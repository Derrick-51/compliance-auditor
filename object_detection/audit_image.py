# This script will be invoked by Node.js 
# to audit photos on the backend.
#
# Audit results will be stored in a JSON file

from segment import preprocessImage, generateMasks, standardizeImageSize
from transform import getFourCorners, transformImage
from compare import compareDHash
import json
import ast
import cv2
import sys
import glob
from pathlib import Path

# Backend src folder
IMAGE_PATH = "./images"
REFERENCE_PATH = "./posters"
RESULTS_PATH = "./analysis_results"
MODEL_PATH = "../object_detection"

# Segmentation model parameters
CONF_THRESHOLD = 0.4
IOU_THRESHOLD = 0.9

# Masks are ignored if they touch mask boundaries
MASK_BOUNDARY_THICKNESS = 3
# Corners below quality level are ignored
CORNER_QUALITY = 0.1
# Corners are ignored if they are too close to another corner (pixel distance)
CORNER_MIN_DISTANCE = 150
# 
CORNER_BLOCK_SIZE = 11
# Posters are accepted if a match with a reference poster is above this threshold
SIMILARITY_THRESHOLD = 0.6


# Read script arguments
imageNames = ast.literal_eval(sys.argv[1])

# Load audit images
images = []
for imageName in imageNames:
    images.append(standardizeImageSize(cv2.imread(f'{IMAGE_PATH}/{imageName}')))

# Segment posters from images
processedImages = []
for image in images:
    processedImages.append(preprocessImage(image))

imageMasks = generateMasks(images,
                           MODEL_PATH,
                           CONF_THRESHOLD,
                           IOU_THRESHOLD,
                           MASK_BOUNDARY_THICKNESS,
                           CORNER_QUALITY,
                           CORNER_MIN_DISTANCE,
                           CORNER_BLOCK_SIZE)

# Load references
referencePaths = (glob.glob(f'{REFERENCE_PATH}/*.jpg')
              + glob.glob(f'{REFERENCE_PATH}/*.jpeg')
              + glob.glob(f'{REFERENCE_PATH}/*.png'))


references = []
for referenceName in referencePaths:
    references.append(cv2.imread(referenceName))

# Compare posters to each reference
results = {}
for imgNum, image in enumerate(images):
    matchFound = False

    for maskNum, imageMask in enumerate(imageMasks[imgNum]):
        corners = getFourCorners(imageMask,
                                 CORNER_QUALITY,
                                 CORNER_MIN_DISTANCE,
                                 CORNER_BLOCK_SIZE)

        for refNum, reference in enumerate(references):
            referenceX = reference.shape[1]
            referenceY = reference.shape[0]
            transformedImage = transformImage(image, corners, referenceX, referenceY)

            similarity = compareDHash(transformedImage, reference, hash_size=8)

            if similarity > SIMILARITY_THRESHOLD:
                results[imageNames[imgNum]] = "Passed"
                matchFound = True
                break
        
        if matchFound:
            break
        
    if not matchFound:
        results[imageNames[imgNum]] = "Failed"


resultsFile = open(f'{RESULTS_PATH}/Audit_{sys.argv[2]}.json', "w")

json.dump(results, resultsFile, indent=4)

resultsFile.close()

sys.exit(0)