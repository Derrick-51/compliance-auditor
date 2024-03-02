from ultralytics import FastSAM
from ultralytics.models.fastsam import FastSAMPrompt
import numpy as np
import cv2

DEVICE = "cpu"
CONF_THRESHOLD = 0.2
IOU_THRESHOLD = 0.9


def preprocessImage(image: cv2.typing.MatLike) -> cv2.typing.MatLike:

    # Resize based on ratio
    widthRatio = image.shape[1] / image.shape[0]
    distanceFromOne = 1 - widthRatio
    if (distanceFromOne < 0.0):
        distanceFromOne *= -1.0

    # Images will likely be shrunk
    if (widthRatio > 1.0): # Horizontal Ratio
        if (distanceFromOne < 0.3): # 4:3 Ratio
            image = cv2.resize(image, (1600, 1200), cv2.INTER_AREA)
        else:
            image = cv2.resize(image, (1920, 1080), cv2.INTER_AREA)
    elif (widthRatio < 1.0): # Vertical Ratio
        if (distanceFromOne < 0.3): # 3:4 Ratio
            image = cv2.resize(image, (1200, 1600), cv2.INTER_AREA)
        else:
            image = cv2.resize(image, (1080, 1920), cv2.INTER_AREA)

    # Process for better segmentation
    image = cv2.bilateralFilter(image, 7, sigmaColor=5, sigmaSpace=10)
    image = cv2.Canny(image, 15, 15, apertureSize=3)
    image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    
    return image


# Determine if mask touches any boundary
def isBoundaryMask(mask: cv2.typing.MatLike) -> bool:
    # Check first rows and last rows
    for col in range(mask.shape[1]):
        if(mask[0, col] or
        mask[1, col] or
        mask[2, col] or
        mask[-1, col] or
        mask[-2, col] or
        mask[-3, col]):
            return True
        
    # Check first columns and last columns
    for row in range(mask.shape[0]):
        if (mask[row, 0] or
            mask[row, 1] or
            mask[row, 2] or
            mask[row, -1] or
            mask[row, -2] or
            mask[row, -3]):
            return True
        
    return False


def generateMasks(images: cv2.typing.MatLike) -> cv2.typing.MatLike:

    model = FastSAM("FastSam-s.pt")

    imageMasks = []

    for imgNum, image in enumerate(images):

        # Generate maks with model
        allResults = model(image,
                           device=DEVICE,
                           verbose=False,
                           retina_masks=False,
                           imgsz=1024,
                           conf=CONF_THRESHOLD,
                           iou=IOU_THRESHOLD)
        promptProcess = FastSAMPrompt(image, allResults, device=DEVICE)
        results = promptProcess.everything_prompt()

        # Ignore bad masks
        acceptedMasks = []
        for result in results[0]:
            bMask = np.zeros(image.shape[:2], np.uint8)
            contour = result.masks.xy.pop()
            contour = contour.astype(np.int32)
            contour = contour.reshape(-1, 1, 2)

            # Ignore empty masks
            if(not contour.shape[0]):
                continue

            cv2.drawContours(bMask, [contour], -1, (255, 255, 255), cv2.FILLED)

            # Ignore boundary touching masks
            if isBoundaryMask(bMask):
                continue

            # Ignore masks with less than 4 corners
            corners = cv2.goodFeaturesToTrack(bMask, maxCorners=4, qualityLevel=0.1, minDistance=100)
            corners = np.int64(corners)

            if(len(corners) >= 4):
                acceptedMasks.append(np.copy(bMask))
        
        imageMasks.append((image, acceptedMasks))

    return imageMasks