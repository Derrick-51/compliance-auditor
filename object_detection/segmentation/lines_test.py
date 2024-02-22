import cv2
import numpy as np

orig_img = cv2.imread("img3.jpg")
seg_img = cv2.imread("seg.png")
ref_img = cv2.imread("ref_img.png")
img_gray = cv2.cvtColor(seg_img, cv2.COLOR_BGR2GRAY)
ref_gray = cv2.cvtColor(ref_img, cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(img_gray, 100, 100, apertureSize=3)

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
refPoints = (ref_img.shape[1], ref_img.shape[0])
perspectivePoints = np.float32([tl_corner, bl_corner, tr_corner, br_corner])
referencePoints = np.float32([(0, 0), (0, refPoints[1]), (refPoints[0], 0), (refPoints[0], refPoints[1])])

# Transform perspective using points
perspectiveMat = cv2.getPerspectiveTransform(perspectivePoints, referencePoints)
transformedImage = cv2.warpPerspective(orig_img, perspectiveMat, refPoints)
cv2.imshow("Transformation", transformedImage)
cv2.imshow("Reference", ref_img)

# Draw points on mask
cornerColors = [(0, 255, 0), (0, 255, 255), (255, 0, 255), (255, 255, 0)]
colorPoints = [tl_corner, bl_corner, tr_corner, br_corner]
for count, corner in enumerate(colorPoints):
    x, y = corner
    cv2.circle(seg_img, (x, y), radius=10, color=cornerColors[count], thickness=-1)

# Prepare images for DCT
transformed_8 = cv2.resize(transformedImage, (8, 8), interpolation=cv2.INTER_AREA)
reference_8 = cv2.resize(ref_gray, (8, 8), interpolation=cv2.INTER_AREA)
transformed_32 = cv2.resize(transformedImage, (32, 32), interpolation=cv2.INTER_AREA)
reference_32 = cv2.resize(ref_gray, (32, 32), interpolation=cv2.INTER_AREA)
transformed_8 = cv2.cvtColor(transformed_8, cv2.COLOR_BGR2GRAY)
transformed_32 = cv2.cvtColor(transformed_32, cv2.COLOR_BGR2GRAY)
transformed_32 = np.float32(transformed_32)
reference_32 = np.float32(reference_32)

# print(transformed_32)
# print(reference_32)

transformed_dct = cv2.dct(transformed_32, cv2.DCT_ROWS)
reference_dct = cv2.dct(reference_32, cv2.DCT_ROWS)

cv2.imshow("Transform DCT", transformed_dct)
cv2.imshow("Reference DCT", reference_dct)

transformed_dct = transformed_dct[:8, :8]
reference_dct = reference_dct[:8, :8]

# Calculate DCT average
transformed_avg = 0.0
reference_avg = 0.0
difference_mat = np.zeros((8, 8))
for row in range(difference_mat.shape[0]):
    for col in range(difference_mat.shape[1]):
        transformed_avg += transformed_dct[row, col]
        reference_avg += reference_dct[row, col]
        difference_mat[row, col] = transformed_dct[row, col] - reference_dct[row, col]
transformed_avg /= difference_mat.shape[0] * difference_mat.shape[1]

# Convert DCT to binary
transformed_bin = np.zeros((8, 8))
reference_bin = np.zeros((8, 8))
for row in range(difference_mat.shape[0]):
    for col in range(difference_mat.shape[1]):
        if transformed_dct[row, col] > transformed_avg:
            transformed_bin[row, col] = 255
        else:
            transformed_bin[row, col] = -255
        if reference_dct[row, col] > transformed_avg:
            reference_bin[row, col] = 255
        else:
            reference_bin[row, col] = -255

transformed_bin = cv2.resize(transformed_bin, (32, 32), interpolation=cv2.INTER_LINEAR)
reference_bin = cv2.resize(reference_bin, (32, 32), interpolation=cv2.INTER_LINEAR)

cv2.imshow("Transformed Hash", transformed_bin)
cv2.imshow("Reference Hash", reference_bin)


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

cv2.imshow("lines", seg_img)

cv2.imwrite("lines_test_edges.png", edges)
cv2.imwrite("lines_test_points.png", seg_img)
cv2.imwrite("lines_test_transform.png", transformedImage)

cv2.waitKey(0)
cv2.destroyAllWindows()