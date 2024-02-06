# This script will be invoked by Node.js 
# to audit photos on the backend.
#
# Audit results will be sent back using the 
# standard output stream via print calls


from ultralytics import YOLO
import sys

confidenceThreshold = 0.4

imagePath = sys.argv[1]

# Find posters in image
model = YOLO("../object_detection/custom_model.pt")
results = model.predict(imagePath, verbose=False, conf=confidenceThreshold)

# Determine if poster exists in image
posterFound = len(results[0].boxes) > 0

if posterFound:
    print("Pass")
else:
    print("Fail")

sys.stdout.flush()
sys.exit(0)