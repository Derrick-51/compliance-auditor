from ultralytics import FastSAM
from ultralytics.models.fastsam import FastSAMPrompt
from pathlib import Path
import numpy as np
import cv2

paths = ["img0.jpg", "img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg", "img6.jpg", "img7.jpg"]
# paths = ["img0.jpg", "img1.jpg", "img2.jpg", "img3.jpg"]

images = []
for pathNum, path in enumerate(paths):
    image = cv2.imread(path, cv2.IMREAD_GRAYSCALE)

    # Resize based on ratio
    widthRatio = image.shape[1] / image.shape[0]
    distanceFromOne = 1 - widthRatio
    if (distanceFromOne < 0.0):
        distanceFromOne *= -1.0

    if (widthRatio > 1.0): # Horizontal Ratio
        if (distanceFromOne < 0.27): # 4:3 Ratio
            image = cv2.resize(image, (1600, 1200), cv2.INTER_AREA)
        else:
            image = cv2.resize(image, (1920, 1080), cv2.INTER_AREA)
    elif (widthRatio < 1.0): # Vertical Ratio
        if (distanceFromOne < 0.27): # 3:4 Ratio
            image = cv2.resize(image, (1200, 1600), cv2.INTER_AREA)
        else:
            image = cv2.resize(image, (1080, 1920), cv2.INTER_AREA)

    # Preprocess for better segmentation
    image = cv2.bilateralFilter(image, 7, sigmaColor=5, sigmaSpace=10)
    # image = cv2.bilateralFilter(image, 9, sigmaColor=75, sigmaSpace=75)
    # image = cv2.Canny(image, 75, 75, apertureSize=5)
    image = cv2.Canny(image, 15, 15, apertureSize=3)
    image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    showImg = np.copy(image)
    showImg = cv2.resize(showImg, (0, 0), fx=0.5, fy=0.5)
    cv2.imshow(f'Image {pathNum}', showImg)

    images.append(image)
    

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
    allResults = model(image, device="cpu", verbose=False, retina_masks=True, imgsz=1024, conf=0.2, iou=0.9)
    promptProcess = FastSAMPrompt(image, allResults, device="cpu")

    results = promptProcess.everything_prompt()

    img = np.copy(results[0].orig_img)
    bMask = []

    print(f'Image {imgNum}: Processing masks')

    for maskNum, result in enumerate(results[0]):
        bMask.append(np.zeros(img.shape[:2], np.uint8))
        contour = result.masks.xy.pop()
        contour = contour.astype(np.int32)
        contour = contour.reshape(-1, 1, 2)

        if(not contour.shape[0]):
            continue

        # print(f'Contour: {contour}')
        # print(f'Contour Shape: {contour.shape}')
        # print(f'Mask Shape: {bMask[maskNum].shape}')

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

        # Dilate and erode to remove rough edges

        # Only accept masks with at least 4 corners
        corners = cv2.goodFeaturesToTrack(bMask[maskNum], maxCorners=4, qualityLevel=0.1, minDistance=150, blockSize=21)
        corners = np.int64(corners)
        

        if(len(corners) >= 4):

            # Test lerp and dilating
            #######################################################################################
            maskWidth = bMask[maskNum].shape[1]
            maskHeight = bMask[maskNum].shape[0]
            lerpMask = cv2.resize(bMask[maskNum], (0, 0), fx=0.03, fy=0.03, interpolation=cv2.INTER_AREA)
            lerpMask = cv2.resize(lerpMask, (maskWidth, maskHeight), interpolation=cv2.INTER_LINEAR)
            for row in range(lerpMask.shape[0]):
                for col in range(lerpMask.shape[1]):
                    if(lerpMask[row][col] > (255 / 2)):
                        lerpMask[row][col] = 255
                    else:
                        lerpMask[row][col] = 0
            cv2.imshow(f'I: {imgNum} M: {maskNum}', lerpMask)
            lerpCorners = cv2.goodFeaturesToTrack(lerpMask, maxCorners=4, qualityLevel=0.5, minDistance=150, blockSize=7)
            lerpCorners = np.int64(corners)
            lerpCornerList = []
            for c in lerpCorners:
                x, y = c.ravel()
                lerpCornerList.append((x, y))
            lerpMask = cv2.cvtColor(lerpMask, cv2.COLOR_GRAY2BGR)
            cornerColors = [(0, 255, 0), (0, 255, 255), (255, 0, 255), (255, 255, 0)]
            for count, corner in enumerate(lerpCornerList):
                x, y = corner
                cv2.circle(lerpMask, (x, y), radius=10, color=cornerColors[count], thickness=-1)
            lerpMask = cv2.resize(lerpMask, (0, 0), fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA)
            
            
            

            
            cv2.imshow(f'Image: {imgNum} Lerp: {maskNum}', lerpMask)
            #######################################################################################

            cornerColors = [(0, 255, 0), (0, 255, 255), (255, 0, 255), (255, 255, 0)]
            cornerList = []
            for c in corners:
                x, y = c.ravel()
                cornerList.append((x, y))
            bMask[maskNum] = cv2.cvtColor(bMask[maskNum], cv2.COLOR_GRAY2BGR)

            for count, corner in enumerate(cornerList):
                x, y = corner
                cv2.circle(bMask[maskNum], (x, y), radius=10, color=cornerColors[count], thickness=-1)

            
            smallMask = cv2.resize(bMask[maskNum], (0, 0), fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA)
            cv2.imshow(f'Image: {imgNum} Contour: {maskNum}', smallMask)

            
    
cv2.waitKey(0)