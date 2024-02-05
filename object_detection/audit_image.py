# This script will be invoked by Node.js 
# to audit photos on the backend.
#
# Audit results will be sent back using the 
# standard output stream via print calls


from ultralytics import YOLO
import cv2
import sys

confidenceThreshold = 0.4

# Read image
imagePath = sys.argv[1]
image = cv2.imread(imagePath)

# Find posters in image
model = YOLO("custom_model.pt")
results = model.predict(image)

# Determine if poster exists in image
posterFound = len(results[0].boxes) > 0

if posterFound:
    # Determine if confidence is above threshold
    if results[0].boxes[0].conf[0] > confidenceThreshold:
        print("Pass")
    else:
        print("Fail")
else:
    print("Fail")

sys.stdout.flush()