# This script will be invoked by Node.js 
# to audit evidence photos uploaded by dealerships.
#
# Audit result will be stored in a txt file
# to be read by Node.js after completion
#
# The best Extracted potential poster will be stored
# in a jpg file

from segment import preprocessImage, generateMasks, standardizeImageSize, filterMasks, fixMaskImperfections
from transform import getFourCorners, transformImage
from compare import compareDHash, compareCosSimilarity, compareSiftFeatures, getCriterionFeatures
import cv2
import sys
from pathlib import Path
from copy import deepcopy

# Backend src folder paths
EVIDENCE_PATH = "./images"
CRITERIA_PATH = "./posters"
EXTRACTED_POSTER_PATH = "./extracted_posters"
ANALYSIS_RESULTS_PATH = "./analysis_results"
MODEL_PATH = "../evidence_analysis"

# Backend src folder paths for TESTING
TEST_EVIDENCE_PATH = "./test_evidence"
TEST_CRITERIA_PATH = "./test_criteria"
TEST_EXTRACTED_POSTER_PATH = "./test_extracted_posters"
TEST_ANALYSIS_RESULTS_PATH = "./test_results"
TEST_MODEL_PATH = "./"

# Segmentation model parameters
CONF_THRESHOLD = 0.2
IOU_THRESHOLD = 0.9
# Masks are ignored if they touch mask boundaries
MASK_BOUNDARY_THICKNESS = 3
# Corners below quality level are ignored
CORNER_QUALITY = 0.1
# Corners are ignored if they are too close to another corner (pixel distance)
CORNER_MIN_DISTANCE = 150
# Affects size of corners detected
CORNER_BLOCK_SIZE = 25
# Higher coefficient makes feature detection less strict
SIFT_RATIO_TEST_COEFF = 0.6
# Posters are accepted if a match with a reference poster is above two thresholds
DHASH_SIMILARITY_THRESHOLD = 0.7
COS_SIMILARITY_THRESHOLD = 0.7
SIFT_FEATURE_THRESHOLD = 0.1

# Argument used to enable testing mode
TEST_ARGUMENT = 'test'
# Position of test argument
TEST_ARGUMENT_POS = 3


# Read script arguments
evidenceName = sys.argv[1]
criteriaName = sys.argv[2]

# Set default paths
evidence_path = EVIDENCE_PATH
criteria_path = CRITERIA_PATH
extracted_poster_path = EXTRACTED_POSTER_PATH
analysis_results_path = ANALYSIS_RESULTS_PATH
model_path = MODEL_PATH

# Change paths for testing mode
inTestingMode = False
if(len(sys.argv) == (TEST_ARGUMENT_POS + 1)):
    if(sys.argv[TEST_ARGUMENT_POS] == 'test'):
        evidence_path = TEST_EVIDENCE_PATH
        criteria_path = TEST_CRITERIA_PATH
        extracted_poster_path = TEST_EXTRACTED_POSTER_PATH
        analysis_results_path = TEST_ANALYSIS_RESULTS_PATH
        model_path = TEST_MODEL_PATH
        inTestingMode = True


# Load images
try:
    evidence = cv2.imread(f'{evidence_path}/{evidenceName}')
    criterion = cv2.imread(f'{criteria_path}/{criteriaName}')
    if(evidence is None):
        filePath = Path(f'{Path.cwd()}/{evidence_path}/{evidenceName}')
        raise FileNotFoundError(f'Evidence image [{filePath}] cannot be read')
    if(criterion is None):
        filePath = Path(f'{Path.cwd()}/{criteria_path}/{criteriaName}')
        raise FileNotFoundError(f'Evidence image [{filePath}] cannot be read')
except FileNotFoundError as err:
    print('ERROR:', err)
    raise


evidence = standardizeImageSize(evidence)

# Process evidence image to improve segmentation
processedEvidence = preprocessImage(evidence)

# Segment objects from evidence image
masks = []
origMasks = generateMasks(evidence,
                        model_path,
                        CONF_THRESHOLD,
                        IOU_THRESHOLD)
masks.extend(origMasks)

edgeMasks = generateMasks(processedEvidence,
                        model_path,
                        CONF_THRESHOLD,
                        IOU_THRESHOLD)
masks.extend(edgeMasks)

# Remove protruding edges and fill divots
masks = fixMaskImperfections(masks)

# Filter object masks that are unlikely to be a poster
masks = filterMasks(masks,
                    MASK_BOUNDARY_THICKNESS,
                    CORNER_QUALITY,
                    CORNER_MIN_DISTANCE,
                    CORNER_BLOCK_SIZE)

# Encode criterion to reuse features in multiple comparisons
criterionFeatures = getCriterionFeatures(criterion)

# Compare extracted poster to criterion
matchFound = False
maxDhashSimilarity = 0.0
maxSiftFeatureRatio = 0.0
maxCosSimilarity = 0.0
bestTransformedEvidence: cv2.typing.MatLike = None
for mask in masks:
    corners = getFourCorners(mask,
                                CORNER_QUALITY,
                                CORNER_MIN_DISTANCE,
                                CORNER_BLOCK_SIZE)
    
    # Use criterion dimensions for evidence transformation
    criterionX = criterion.shape[1]
    criterionY = criterion.shape[0]
    transformedEvidence = transformImage(evidence, corners, criterionX, criterionY)

    # Compare image similarities
    dhashSimilarity = compareDHash(transformedEvidence, criterion)
    siftFeatureRatio = compareSiftFeatures(transformedEvidence, criterion)
    cosSimilarity = compareCosSimilarity(transformedEvidence, criterionFeatures)
    
    # Check if result is closer than previous results
    closerResults = 0
    if(dhashSimilarity > maxDhashSimilarity):
        maxDhashSimilarity = dhashSimilarity
        closerResults += 1
    if(siftFeatureRatio > maxSiftFeatureRatio):
        maxSiftFeatureRatio = siftFeatureRatio
        closerResults += 1
    if(cosSimilarity > maxCosSimilarity):
        maxCosSimilarity = cosSimilarity
        closerResults += 1
        
    # At least 2 passes are required for an overall pass
    passes = 0
    if(dhashSimilarity > DHASH_SIMILARITY_THRESHOLD):
        passes += 1
    if(siftFeatureRatio > SIFT_FEATURE_THRESHOLD):
        passes += 1
    if(cosSimilarity > COS_SIMILARITY_THRESHOLD):
        passes += 1

    # Keep track of best potential extracted poster
    if(closerResults > 1 or passes > 1):
        bestTransformedEvidence = deepcopy(transformedEvidence)

    if(inTestingMode):
        print('//////////////////////////////')
        print(f'dhash: {dhashSimilarity}')
        print(f'sift: {siftFeatureRatio}')
        print(f'cos: {cosSimilarity}')

    if(passes > 1):
        matchFound = True
        break


if(inTestingMode):
        print('==============================')
        print(f'Max dhash similarity: {maxDhashSimilarity}')
        print(f'Max sift features: {maxSiftFeatureRatio}')
        print(f'Max cosine similarity: {maxCosSimilarity}')

# Save best potential extracted poster
if(bestTransformedEvidence is not None):
    cv2.imwrite(f'{extracted_poster_path}/{evidenceName}',
                img=bestTransformedEvidence)


if matchFound:
    result = "Passed"
else:
    result = "Failed"

# Create temporary file to store results
resultFile = open(f'{analysis_results_path}/{Path(evidenceName).stem}.txt', 'w')
resultFile.write(result)
resultFile.close()

sys.exit(0)