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
CORNER_QUALITY = 0.4
# Corners are ignored if they are too close to another corner (pixel distance)
CORNER_MIN_DISTANCE = 150
# 
CORNER_BLOCK_SIZE = 3
# Posters are accepted if a match with a reference poster is above this threshold
SIMILARITY_THRESHOLD = 0.64


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
                           CORNER_MIN_DISTANCE,
                           CORNER_BLOCK_SIZE)

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

    for maskNum, imageMask in enumerate(imageMasks[imgNum]):
        corners = getFourCorners(imageMask,
                                 CORNER_QUALITY,
                                 CORNER_MIN_DISTANCE,
                                 CORNER_BLOCK_SIZE)

        # TEST ##################################
        # Draw points on mask
        mask = imageMask
        mask = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
        cornerColors = [(0, 255, 0), (0, 255, 255), (255, 0, 255), (255, 255, 0)]
        for count, corner in enumerate(corners):
            x, y = corner
            cv2.circle(mask, (x, y), radius=10, color=cornerColors[count], thickness=-1)
        cv2.imshow(f'Image: {imgNum} Mask: {maskNum}', mask)
        #########################################


        for refNum, reference in enumerate(references):
            referenceX = reference.shape[1]
            referenceY = reference.shape[0]
            transformedImage = transformImage(image, corners, referenceX, referenceY)
            cv2.imshow(f'Image: {imgNum}', transformedImage)

            similarity = compareDHash(transformedImage, reference, hash_size=8)

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
    

cv2.waitKey(0)
sys.exit(0)