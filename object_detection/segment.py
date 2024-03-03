from typing import List
import numpy as np
import cv2

DEVICE = "cpu"


def standardizeImageSize(image: cv2.typing.MatLike) -> cv2.typing.MatLike:
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

    return image

def preprocessImage(image: cv2.typing.MatLike) -> cv2.typing.MatLike:

    image = standardizeImageSize(image)

    # Process for better segmentation
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    image = cv2.bilateralFilter(image, 7, sigmaColor=5, sigmaSpace=10)
    image = cv2.Canny(image, 15, 15, apertureSize=3)
    image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    
    return image


# Determine if mask touches given boundary
def isBoundaryMask(mask: cv2.typing.MatLike, thickness: int=1) -> bool:
    # Check first rows and last rows
    for col in range(mask.shape[1]):
        for row in range(thickness):

            negative_row = (thickness - row) * -1
            if(mask[row, col] or mask[negative_row, col]):
                return True
        
    # Check first columns and last columns
    for row in range(mask.shape[0]):
        for col in range(thickness):

            negative_col = (thickness - col) * -1
            if(mask[row, col] or mask[row, negative_col]):
                return True
        
    return False


def generateMasks(images: List[cv2.typing.MatLike],
                  conf_threshold: float=0.2,
                  iou_threshold: float=0.9,
                  boundary_thickness: int=1,
                  corner_quality: float=0.1,
                  corner_min_distance: float=100.0) -> List[cv2.typing.MatLike]:
    from ultralytics import FastSAM
    from ultralytics.models.fastsam import FastSAMPrompt

    model = FastSAM("FastSam-s.pt")

    imageMasks = []

    for imgNum, image in enumerate(images):

        # Generate maks with model
        allResults = model(image,
                           device=DEVICE,
                           verbose=False,
                           retina_masks=False,
                           imgsz=1024,
                           conf=conf_threshold,
                           iou=iou_threshold)
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
            if isBoundaryMask(bMask, boundary_thickness):
                continue

            # Ignore masks with less than 4 corners
            corners = cv2.goodFeaturesToTrack(bMask, maxCorners=4, qualityLevel=corner_quality, minDistance=corner_min_distance)
            corners = np.int64(corners)

            if(len(corners) >= 4):
                acceptedMasks.append(np.copy(bMask))
        
        imageMasks.append((image, acceptedMasks))

    return imageMasks