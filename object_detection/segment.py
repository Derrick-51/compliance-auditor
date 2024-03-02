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

def generateMasks(images: cv2.typing.MatLike) -> cv2.typing.MatLike:

    model = FastSAM("FastSam-s.pt")

    imageMasks = []

    for imgNum, image in enumerate(images):

        allResults = model(image,
                           device=DEVICE,
                           verbose=False,
                           retina_masks=False,
                           imgsz=1024,
                           conf=CONF_THRESHOLD,
                           iou=IOU_THRESHOLD)
        promptProcess = FastSAMPrompt(image, allResults, device=DEVICE)
        results = promptProcess.everything_prompt()

        img = np.copy(results[0].orig_img)
        acceptedMasks = []

        for result in results[0]:
            bMask = np.zeros(image.shape[:2], np.uint8)
            contour = result.masks.xy.pop()
            contour = contour.astype(np.int32)
            contour = contour.reshape(-1, 1, 2)

            if(not contour.shape[0]):
                continue


            cv2.drawContours(bMask, [contour], -1, (255, 255, 255), cv2.FILLED)

            # Remove boundary touching masks
            rejected = False
            # Check first rows and last rows
            for col in range(bMask.shape[1]):
                if(bMask[0, col] or
                bMask[1, col] or
                bMask[2, col] or
                bMask[-1, col] or
                bMask[-2, col] or
                bMask[-3, col]):
                    rejected = True
                    break
            # Check first columns and last columns
            if not rejected:
                for row in range(bMask.shape[0]):
                    if (bMask[row, 0] or
                        bMask[row, 1] or
                        bMask[row, 2] or
                        bMask[row, -1] or
                        bMask[row, -2] or
                        bMask[row, -3]):
                        rejected = True
                        break
            if rejected:
                continue

            # Only accept masks with at least 4 corners
            corners = cv2.goodFeaturesToTrack(bMask, maxCorners=4, qualityLevel=0.1, minDistance=100)
            corners = np.int64(corners)

            if(len(corners) >= 4):
                acceptedMasks.append(np.copy(bMask))
        
        imageMasks.append((image, acceptedMasks))

    return imageMasks