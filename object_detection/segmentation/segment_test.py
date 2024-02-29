from ultralytics import FastSAM
from ultralytics.models.fastsam import FastSAMPrompt
from pathlib import Path
import numpy as np
import cv2

paths = ["img0.jpg", "img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg"]
# images = ["img0.jpg"]

images = []
for pathNum, path in enumerate(paths):
    images.append(cv2.imread(path, cv2.IMREAD_GRAYSCALE))
    images[pathNum] = cv2.bilateralFilter(images[pathNum], 7, sigmaColor=5, sigmaSpace=10)
    images[pathNum] = cv2.Canny(images[pathNum], 15, 15, apertureSize=3)
    images[pathNum] = cv2.cvtColor(images[pathNum], cv2.COLOR_GRAY2BGR)

model = FastSAM("FastSAM-s.pt")

# #TEST
# #####
# #####

# origImgTest = cv2.imread("img3.jpg", cv2.IMREAD_GRAYSCALE)
# cv2.imshow("image test orig", origImgTest)
# imgTest = cv2.bilateralFilter(origImgTest, 7, sigmaColor=5, sigmaSpace=10)
# cv2.imshow("image test blur", imgTest)

# # # Unsharp Mask
# # ##############
# # unsharpBlur = cv2.GaussianBlur(origImgTest, (63, 63), 0)
# # cv2.imshow("Unsharp Blur", unsharpBlur)
# # unsharpMask = cv2.subtract(imgTest, unsharpBlur)
# # cv2.imshow("Unsharp Mask", unsharpMask)
# # imgTest = cv2.addWeighted(imgTest, 0, unsharpMask, 0, 0)
# # cv2.imshow("image test sharp", imgTest)
# # ##############

# imgTest = cv2.Canny(imgTest, 15, 15, apertureSize=3)
# cv2.imwrite("imgTest_edges.jpg", imgTest)
# images = ["imgTest_edges.jpg"]
# cv2.imshow(f"Image test edges", imgTest)

# #####
# #####
# #####

for imgNum, image in enumerate(images):
    allResults = model(image, device="cpu", verbose=False, retina_masks=False, imgsz=1024, conf=0.2, iou=0.9)
    promptProcess = FastSAMPrompt(image, allResults, device="cpu")

    results = promptProcess.everything_prompt()

    img = np.copy(results[0].orig_img)
    bMask = []

    for maskNum, result in enumerate(results[0]):
        bMask.append(np.zeros(img.shape[:2], np.uint8))
        contour = result.masks.xy.pop()
        contour = contour.astype(np.int32)
        contour = contour.reshape(-1, 1, 2)

        cv2.drawContours(bMask[maskNum], [contour], -1, (255, 255, 255), cv2.FILLED)

        # Remove boundary touching masks
        rejected = False
        # Check first 2 rows and last 2 rows
        for col in range(bMask[maskNum].shape[1]):
            if(bMask[maskNum][0, col] or
               bMask[maskNum][1, col] or
               bMask[maskNum][-1, col] or
               bMask[maskNum][-2, col]):
                rejected = True
                break
        # Check first 2 columns and last 2 columns
        if not rejected:
            for row in range(bMask[maskNum].shape[0]):
                if (bMask[maskNum][row, 0] or
                    bMask[maskNum][row, 1] or
                    bMask[maskNum][row, -1] or
                    bMask[maskNum][row, -2]):
                    rejected = True
                    break
        if rejected:
            continue

        # Only accept masks with at least 4 corners
        corners = cv2.goodFeaturesToTrack(bMask[maskNum], maxCorners=4, qualityLevel=0.1, minDistance=100)
        corners = np.int64(corners)

        if(len(corners) >= 4):
            cv2.imshow(f'Image: {imgNum} Contour: {maskNum}', bMask[maskNum])
    
cv2.waitKey(0)