import cv2
import os

videosPath = './videos'
videoNames = os.listdir(videosPath)

for videoName in videoNames:
    print(f"Extracting frames: {videoName}")
    videoName = os.path.join(videosPath, videoName)
    capture = cv2.VideoCapture(videoName)
    frameInterval = 30 # Interval to save frames

    active,frame = capture.read()
    frameCount = 0

    # Save frames
    while(active):
        if((frameCount % frameInterval) == 0):
            frameName = os.path.basename(videoName)
            frameName = os.path.splitext(frameName)[0]
            cv2.imwrite(f"frames/{frameName}_frame{frameCount:05d}.jpg", frame)
            print(f"Saving frame: {frameCount}")
        active,frame = capture.read()
        frameCount += 1