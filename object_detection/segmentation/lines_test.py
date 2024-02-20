import cv2
import numpy as np

orig_img = cv2.imread("img3.jpg")
image = cv2.imread("seg.png")
ref_img = cv2.imread("ref_img.png")
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(gray, 100, 100, apertureSize=3)

cv2.imshow("Original", orig_img)
cv2.imshow("edges", edges)

# Corner Detection
corners = cv2.goodFeaturesToTrack(edges, maxCorners=4, qualityLevel=0.1, minDistance=100)
corners = np.int64(corners)

# Extract points
cornerList = []
for c in corners:
    x, y = c.ravel()
    cornerList.append((x, y))

# Sort right corners
rightCorners = [cornerList[0], cornerList[1]]
for corner in cornerList[2:]:
    if rightCorners[0][0] < corner[0]:
        rightCorners[0] = corner
    elif rightCorners[1][0] < corner[0]:
        rightCorners[1] = corner

# Swap top and bottom right corners
if rightCorners[0][1] < rightCorners[1][1]:
    tr_corner, br_corner = (rightCorners[0], rightCorners[1])
else:
    tr_corner, br_corner = (rightCorners[1], rightCorners[0])

# Sort left corners
leftCorners = [cornerList[0], cornerList[1]]
for corner in cornerList[2:]:
    if leftCorners[0][0] > corner[0]:
        leftCorners[0] = corner
    elif leftCorners[1][0] > corner[0]:
        leftCorners[1] = corner

# Swap top and bottom left corners
if leftCorners[0][1] > leftCorners[1][1]:
    tl_corner, bl_corner = (leftCorners[1], leftCorners[0])
else:
    tl_corner, bl_corner = (leftCorners[0], leftCorners[1])

# Prepare transformation points
origPoints = (orig_img.shape[0], orig_img.shape[1])
perspectivePoints = np.float32([tl_corner, bl_corner, tr_corner, br_corner])
referencePoints = np.float32([(0, 0), (0, origPoints[1]), (origPoints[0], 0), (origPoints[0], origPoints[1])])

# Transform perspective using points
perspectiveMat = cv2.getPerspectiveTransform(perspectivePoints, referencePoints)
transformedImage = cv2.warpPerspective(orig_img, perspectiveMat, origPoints)
cv2.imshow("Transformation", transformedImage)


cornerColors = [(0, 255, 0), (0, 255, 255), (255, 0, 255), (255, 255, 0)]
colorPoints = [tl_corner, bl_corner, tr_corner, br_corner]
for count, corner in enumerate(colorPoints):
    x, y = corner
    cv2.circle(image, (x, y), radius=10, color=cornerColors[count], thickness=-1)

# # Line Detection
# lines = cv2.HoughLinesP(
#     edges,
#     1,
#     np.pi/180,
#     threshold=100,
#     minLineLength=10,
#     maxLineGap=10
# )

# lineList = []
# for points in lines:
#     x0, y0, x1, y1 = points[0]

#     cv2.line(image, (x0, y0), (x1, y1), (0, 0, 255), 2)
#     lineList.append([(x0, y0), (x1, y1)])

cv2.imshow("lines", image)

cv2.imwrite("lines_test_edges.png", edges)
cv2.imwrite("lines_test_points.png", image)
cv2.imwrite("lines_test_transform.png", transformedImage)

cv2.waitKey(0)
cv2.destroyAllWindows()