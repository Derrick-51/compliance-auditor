import cv2
from ultralytics import YOLO

capture = cv2.VideoCapture(0)

# YOLOv8 accepted input size
# capture.set(3, 640)
# capture.set(4, 480)

model = YOLO("custom_model.pt")

classes = ["poster"]

while True:
    active, frame = capture.read()

    if not active:
        continue

    results = model.predict(frame)

    for result in results:
        for box in result.boxes:
            x0, y0, x1, y1 = box.xyxy[0] # Get data from tensor type
            x0, y0, x1, y1 = int(x0), int(y0), int(x1), int(y1)

            className = classes[int(box.cls[0])]
            #confidence = box.conf[0]
            text = f"{className} {box.conf[0]:.2f}"
            fontFace = cv2.FONT_HERSHEY_PLAIN
            fontColor = (255, 255, 255)
            fontScale = 1
            fontThickness = 1

            cv2.rectangle(frame, (x0, y0), (x1, y1), (0, 0, 255), thickness=2)
            textSize, _ = cv2.getTextSize(className, fontFace, fontScale, fontThickness)
            text_x, text_y = textSize
            text_x += 4
            text_y += 4
            cv2.rectangle(frame, (x0, y0), (x0 + text_x, y0 + text_y), (0, 0, 255), thickness=-1)
            cv2.putText(frame, className, (x0 + 2, y0 + text_y + fontScale - 1), fontFace, fontScale, fontColor, fontThickness)
            
            
    cv2.imshow("Capture", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

capture.release()
cv2.destroyAllWindows()