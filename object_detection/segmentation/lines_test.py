import cv2
import numpy as np

orig_img = cv2.imread("img3.jpg")
image = cv2.imread("seg.png")
ref_img = cv2.imread("ref_img.png")
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(gray, 100, 100, apertureSize=3)

cv2.imshow("edges", edges)

# Corner Detection
corners = cv2.goodFeaturesToTrack(edges, maxCorners=4, qualityLevel=0.1, minDistance=100)
corners = np.int64(corners)

cornerColors = [(0, 255, 0), (0, 255, 255), (255, 0, 255), (255, 255, 0)]

for count, corner in enumerate(corners):
    x, y = corner.ravel()
    cv2.circle(image, (x, y), radius=10, color=cornerColors[count], thickness=-1)

# Line Detection
lines = cv2.HoughLinesP(
    edges,
    1,
    np.pi/180,
    threshold=100,
    minLineLength=10,
    maxLineGap=10
)

lineList = []
for points in lines:
    x0, y0, x1, y1 = points[0]

    cv2.line(image, (x0, y0), (x1, y1), (0, 0, 255), 2)
    lineList.append([(x0, y0), (x1, y1)])

cv2.imshow("lines", image)

cv2.imwrite("hough_test_sample.png", image)

cv2.waitKey(0)
cv2.destroyAllWindows()