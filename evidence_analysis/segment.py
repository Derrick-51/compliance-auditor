from typing import List
import numpy as np
import cv2

DEVICE = "cpu"

# Resize images to standard ratios (4:3, 3:4, 16:9, 9:16)
def standardizeImageSize(image: cv2.typing.MatLike) -> cv2.typing.MatLike:
    # Resize based on ratio
    widthRatio = image.shape[1] / image.shape[0]
    heightRatio = image.shape[0] / image.shape[1]
    isHorizontal = True
    if (heightRatio > 1):
        isHorizontal = False

    # Images will likely be shrunk
    if (isHorizontal): # Horizontal Ratio
        if (heightRatio > 0.7):
            image = cv2.resize(image, (1600, 1200), cv2.INTER_AREA) # 4:3 Ratio
        else:
            image = cv2.resize(image, (1920, 1080), cv2.INTER_AREA) # 16:9 Ratio
    else: # Vertical Ratio
        if (widthRatio > 0.7):
            image = cv2.resize(image, (1200, 1600), cv2.INTER_AREA) # 3:4 Ratio
        else:
            image = cv2.resize(image, (1080, 1920), cv2.INTER_AREA) # 9:16 Ratio

    return image

# Process image into strong binary edges image
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

# Generate masks for objects in image
def generateMasks(image: cv2.typing.MatLike,
                  model_path: str,
                  conf_threshold: float=0.2,
                  iou_threshold: float=0.9) -> List[cv2.typing.MatLike]:
    from ultralytics import FastSAM
    from ultralytics.models.fastsam import FastSAMPrompt

    model = FastSAM(f'{model_path}/FastSam-x.pt')


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

    masks = []
    for result in results[0]:
        bMask = np.zeros(image.shape[:2], np.uint8)
        contour = result.masks.xy.pop()
        contour = contour.astype(np.int32)
        contour = contour.reshape(-1, 1, 2)

        # Ignore empty masks
        if(not contour.shape[0]):
            continue

        cv2.drawContours(bMask, [contour], -1, (255, 255, 255), cv2.FILLED)
        masks.append(bMask)
    
    return masks

# Remove masks that do not have 4 points
def filterMasks(masks: List[cv2.typing.MatLike],
                boundary_thickness: int=1,
                corner_quality: float=0.1,
                corner_min_distance: float=100.0,
                corner_block_size: int = 3) -> List[cv2.typing.MatLike]:

    acceptedMasks = []
    for mask in masks:
        # Ignore boundary touching masks
        if isBoundaryMask(mask, boundary_thickness):
            continue

        # Ignore masks with less than 4 corners
        corners = cv2.goodFeaturesToTrack(mask,
                                            maxCorners=4,
                                            qualityLevel=corner_quality,
                                            minDistance=corner_min_distance,
                                            blockSize=corner_block_size)
        
        # Ignore mask if no corners found
        if(corners is None):
            continue
        
        corners = np.int64(corners)

        # Only accept masks with at least 4 points
        if(len(corners) >= 4):
            acceptedMasks.append(np.copy(mask))
    
    return acceptedMasks

# Remove protruding edges and fill divots in masks
def fixMaskImperfections(masks: List[cv2.typing.MatLike]) -> List[cv2.typing.MatLike]:

    fixedMasks = []
    for mask in masks:
        # Remove protruding edge defects in mask
        kernel = np.ones((5,5),np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=15)

        # Fill concave divots in mask
        contours, hierarchy = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        if(len(contours)):
            hull = cv2.convexHull(contours[0])
            mask = cv2.drawContours(mask, [hull], -1, (255, 255, 255), cv2.FILLED)

        fixedMasks.append(np.copy(mask))
    
    return fixedMasks