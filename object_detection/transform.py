from typing import List, Union
import numpy as np
import cv2

def getFourCorners(mask: cv2.typing.MatLike,
                   quality: float=0.1,
                   min_distance: float=100.0) -> List[Union[np.int64, np.int64]]:

    # Corner Detection
    corners = cv2.goodFeaturesToTrack(mask,
                                      maxCorners=4,
                                      qualityLevel=quality,
                                      minDistance=min_distance)
    corners = np.int64(corners)

    # Extract points
    cornerList = []
    for c in corners:
        x, y = c.ravel()
        cornerList.append((x, y))

    return cornerList


def transformImage(image: cv2.typing.MatLike,
                   corners: List[Union[np.int64, np.int64]],
                   output_x: np.int64,
                   output_y: np.int64) -> cv2.typing.MatLike:

    # Sort by X axis
    corners = sorted(corners, key=lambda corner: corner[0])

    # Sort by Y axis
    if corners[0][1] > corners[1][1]:
        corners[0], corners[1] = corners[1], corners[0]
    if corners[2][1] > corners[3][1]:
        corners[2], corners[3] = corners[3], corners[2]

    inputPoints = np.float32([(corners[0], corners[1], corners[2], corners[3])])
    outputPoints = np.float32([(0, 0), (0, output_y), (output_x, 0), (output_x, output_y)])

    # Transform perspective using output size
    perspectiveMat = cv2.getPerspectiveTransform(inputPoints, outputPoints)
    transformedImage = cv2.warpPerspective(image, perspectiveMat, (output_x, output_y))

    return transformedImage