from ultralytics import YOLO

if __name__ == '__main__': # Fixes error (https://github.com/ultralytics/ultralytics/issues/557#issuecomment-1400980025)
    # Load a model
    model = YOLO("yolov8n.yaml")  # build a new model from scratch

    # Use the model
    model.train(data="data/dataset.yaml", epochs=100) # train the model