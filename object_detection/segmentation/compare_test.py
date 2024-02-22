import cv2
import numpy as np


orig_img = cv2.imread("lines_test_transform_jpg.jpg")
ref_img = cv2.imread("ref_img.png")
orig_gray = cv2.cvtColor(orig_img, cv2.COLOR_BGR2GRAY)
ref_gray = cv2.cvtColor(ref_img, cv2.COLOR_BGR2GRAY)


# ORB Keypoints
###########################################################

# # Generate ORB keypoints
# orb = cv2.ORB.create()
# trans_keypoints, trans_descriptors = orb.detectAndCompute(orig_gray, None)
# ref_keypoints, ref_descriptors = orb.detectAndCompute(ref_gray, None)

# # Match keypoints
# matcher = cv2.BFMatcher(cv2.NORM_HAMMING2, crossCheck=True)
# matches = matcher.match(trans_descriptors, ref_descriptors)
# matches = sorted(matches,key=lambda x:x.distance)

# match_img = cv2.drawMatches(orig_img, trans_keypoints, ref_img, ref_keypoints, matches[:10], None)
# match_img = cv2.resize(match_img, (1600, 1000))
# cv2.imshow("Matches", match_img)
###########################################################


# SIFT Keypoints
###########################################################

# Generate keypoints
sift = cv2.SIFT_create()
orig_keypoints, orig_descriptors = sift.detectAndCompute(orig_gray, None)
ref_keypoints, ref_descriptors = sift.detectAndCompute(ref_gray, None)

print(orig_keypoints)
print("///////////////////////////////")
print(orig_descriptors)

# Match keypoints
matcher = cv2.BFMatcher()
matches = matcher.match(orig_descriptors, ref_descriptors)
matches = sorted(matches,key=lambda x:x.distance)

# Display matches
match_img = cv2.drawMatches(orig_img, orig_keypoints, ref_img, ref_keypoints, matches[:20], None)
match_img = cv2.resize(match_img, (1400, 1000))
cv2.imshow("SIFT Kyepoints", match_img)
###########################################################


# Homemade phash (it's pretty bad)
###########################################################

# # Prepare images for DCT
# transformed_8 = cv2.resize(transformedImage, (8, 8), interpolation=cv2.INTER_AREA)
# reference_8 = cv2.resize(ref_gray, (8, 8), interpolation=cv2.INTER_AREA)
# transformed_32 = cv2.resize(transformedImage, (32, 32), interpolation=cv2.INTER_AREA)
# reference_32 = cv2.resize(ref_gray, (32, 32), interpolation=cv2.INTER_AREA)
# transformed_8 = cv2.cvtColor(transformed_8, cv2.COLOR_BGR2GRAY)
# transformed_32 = cv2.cvtColor(transformed_32, cv2.COLOR_BGR2GRAY)
# transformed_32 = np.float32(transformed_32)
# reference_32 = np.float32(reference_32)

# # print(transformed_32)
# # print(reference_32)

# transformed_dct = cv2.dct(transformed_32, cv2.DCT_ROWS)
# reference_dct = cv2.dct(reference_32, cv2.DCT_ROWS)

# cv2.imshow("Transform DCT", transformed_dct)
# cv2.imshow("Reference DCT", reference_dct)

# transformed_dct = transformed_dct[:8, :8]
# reference_dct = reference_dct[:8, :8]

# # Calculate DCT average
# transformed_avg = 0.0
# reference_avg = 0.0
# difference_mat = np.zeros((8, 8))
# for row in range(difference_mat.shape[0]):
#     for col in range(difference_mat.shape[1]):
#         transformed_avg += transformed_dct[row, col]
#         reference_avg += reference_dct[row, col]
#         difference_mat[row, col] = transformed_dct[row, col] - reference_dct[row, col]
# transformed_avg /= difference_mat.shape[0] * difference_mat.shape[1]

# # Convert DCT to binary
# transformed_bin = np.zeros((8, 8))
# reference_bin = np.zeros((8, 8))
# for row in range(difference_mat.shape[0]):
#     for col in range(difference_mat.shape[1]):
#         if transformed_dct[row, col] > transformed_avg:
#             transformed_bin[row, col] = 255
#         else:
#             transformed_bin[row, col] = -255
#         if reference_dct[row, col] > transformed_avg:
#             reference_bin[row, col] = 255
#         else:
#             reference_bin[row, col] = -255

# transformed_bin = cv2.resize(transformed_bin, (32, 32), interpolation=cv2.INTER_LINEAR)
# reference_bin = cv2.resize(reference_bin, (32, 32), interpolation=cv2.INTER_LINEAR)

# cv2.imshow("Transformed Hash", transformed_bin)
# cv2.imshow("Reference Hash", reference_bin)
###########################################################


cv2.waitKey(0)