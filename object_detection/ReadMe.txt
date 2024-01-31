General video capture guidelines:
    - Try to get videos of a noisy scene
        (e.g. busy place, windows, grass, near other posters, etc.)

    - Get many angles in the video, and try not to have the poster in the
        center of the frame for most of the video.

    - Keep videos at 1080p or lower resolution
        (high resolution won't help and video size will be large)

    - Keep videos at 1 minute or less. Data will be 1 image / sec, meaning
        60 frames for a minute of video. That's more than enough of one scene.

Splitting videos:
    1. Install opencv-python (https://pypi.org/project/opencv-python/)
        (Note: pip is installed with python)

    2. Put videos in videos folder. (<project root>/object_detection/data/videos)

    3. Navigate to data folder in terminal.
        (<project root>/object_detection/data)

    4. Run video_to_images.py from terminal.

    5. Images will save to unsorted images folder.
        (<project root>/object_detection/data/unsorted/images)

Labeling dataset:
    Note: Use whatever software works best for you that outputs to YOLO format.

    Note: Try to contain the object tightly in the bounding box, but don't worry
        too much about it being perfect

    YOLO Format: A .txt file exactly matching the corresponding image file's
        name, and has the following data, in rows, for each bounding box:
        [class x_center y_center width height]
        (e.g. 0 0.414583 0.543519 0.215625 0.555556)

    Local: If using downloaded software, open the unsorted images folder and set
        the software's output folder to the unsorted labels folder.
        (<project root>/object_detection/data/unsorted)
    
    Cloud: If using cloud software, upload the images in the unsorted images
        folder to the cloud software and save the resulting labels in the
        unsorted labels folder. (<project root>/object_detection/data/unsorted)

Uploading dataset for group:
    Note: Be sure to keep images and labels in separate folders in zip file