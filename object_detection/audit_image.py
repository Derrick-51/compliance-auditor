# This script will be invoked by Node.js 
# to audit photos on the backend.
#
# Audit results will be stored in a JSON file

from segment import preprocessImage, generateMasks, standardizeImageSize
from transform import getFourCorners, transformImage
from compare import compareDHash
import json
import cv2
import sys
import glob
from pathlib import Path

# Backend src folder
IMAGE_PATH = "./images"
REFERENCE_PATH = "./posters"

# Segmentation model parameters
CONF_THRESHOLD = 0.4
IOU_THRESHOLD = 0.9

# Masks are ignored if they touch mask boundaries
MASK_BOUNDARY_THICKNESS = 3
# Corners below quality level are ignored
CORNER_QUALITY = 0.1
# Corners are ignored if they are too close to another corner (pixel distance)
CORNER_MIN_DISTANCE = 100
# Posters are accepted if a match with a reference poster is above this threshold
SIMILARITY_THRESHOLD = 0.7


# Read script arguments
# imageNames = sys.argv[1]
# imageNames = json.loads(imageNames)
imageNames = ["img0.jpg", "img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg", "img6.jpg", "img7.jpg"]

# Load audit images
images = []
for imageName in imageNames:
    # images.append(cv2.imread(f'{ROOT_PATH}images/{imageName}'))
    images.append(standardizeImageSize(cv2.imread(f'{IMAGE_PATH}/{imageName}')))

# Segment posters from images
processedImages = []
for image in images:
    processedImages.append(preprocessImage(image))

imageMasks = generateMasks(images,
                           CONF_THRESHOLD,
                           IOU_THRESHOLD,
                           MASK_BOUNDARY_THICKNESS,
                           CORNER_QUALITY,
                           CORNER_MIN_DISTANCE)

# Load references
referencePaths = (glob.glob(f'{REFERENCE_PATH}/*.jpg')
              + glob.glob(f'{REFERENCE_PATH}/*.jpeg')
              + glob.glob(f'{REFERENCE_PATH}/*.png'))

# for refNum in range(len(referencePaths)):
#     referencePaths[refNum] = F'{REFERENCE_PATH}/{Path(referencePaths[refNum]).name}'

references = []
for referenceName in referencePaths:
    references.append(cv2.imread(referenceName))

# Compare posters to each reference
results = {}
for imgNum, image in enumerate(images):
    matchFound = False
    print(f'Image: {imgNum}')
    print(f'')

    for imageMask in imageMasks:
        corners = getFourCorners(imageMask, CORNER_QUALITY, CORNER_MIN_DISTANCE)

        for refNum, reference in enumerate(references):
            referenceX = reference.shape[1]
            referenceY = reference.shape[0]
            transformedImage = transformImage(image, corners, referenceX, referenceY)

            similarity = compareDHash(transformedImage, reference, hash_size=16)

            print(f'Image: {imgNum} Similarity: {similarity}')

            if similarity > SIMILARITY_THRESHOLD:
                results[imageNames[imgNum]] = "Passed"
                matchFound = True
                break
        
        if matchFound:
            break
        
    if not matchFound:
        results[imageNames[imgNum]] = "Failed"

print(results)
    


sys.exit(0)