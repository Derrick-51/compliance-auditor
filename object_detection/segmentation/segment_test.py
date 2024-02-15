from ultralytics.models.sam import Predictor as SAMPredictor
import torch
import cv2

overrides = dict(conf=0.25, task="segment", mode="predict", imgsz=1024, model="sam_l.pt")
predictor = SAMPredictor(overrides=overrides)

# Set image to encode once
image = cv2.imread("img1.jpg")
image = torch.tensor(image)
imgHeight, imgLength, _ = image.shape
bbox = [(imgLength/4), (imgHeight/4), ((imgLength/4)*3), ((imgLength/4)*3)]
# predictor.set_image(image)


results = predictor.inference(
    image,
    bboxes=[bbox],
    points=None,
    labels=None,
    masks=None,
    multimask_output=True)

print(results)

# predictor.reset_image()

cv2.imshow("test", image)
cv2.waitKey(0)
