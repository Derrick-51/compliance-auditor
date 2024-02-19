from ultralytics import FastSAM
from ultralytics.models.fastsam import FastSAMPrompt
import numpy as np
import cv2

source = "img3.jpg"

model = FastSAM("FastSAM-s.pt")

allResults = model(source, device="cpu", retina_masks=True, imgsz=1024, conf=0.4, iou=0.9)

promptProcess = FastSAMPrompt(source, allResults, device="cpu")

results = promptProcess.everything_prompt()

img = np.copy(results[0].orig_img)
bMask = np.zeros(img.shape[:2], np.uint8)

for count, result in enumerate(results):
    contour = result.masks.xy.pop()
    contour = contour.astype(np.int32)
    contour = contour.reshape(-1, 1, 2)

    cv2.drawContours(bMask, [contour], -1, (255, 255, 255), cv2.FILLED)
    cv2.imshow(f'Contour: {count}', bMask)
    
cv2.waitKey(0)




