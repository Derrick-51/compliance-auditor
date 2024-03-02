import cv2

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

    # Preprocess for better segmentation
    image = cv2.bilateralFilter(image, 7, sigmaColor=5, sigmaSpace=10)
    image = cv2.Canny(image, 15, 15, apertureSize=3)
    image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    
    return image
