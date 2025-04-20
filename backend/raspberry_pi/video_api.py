from flask import Flask, Response
import threading
import time
import cv2
from ultralytics import YOLO

app = Flask(__name__)

# 🔥 Update this if Pi's IP changes!
CAMERA_STREAM_URL = "tcp://192.168.137.83:8888"
cap = cv2.VideoCapture(CAMERA_STREAM_URL)

# Load YOLOv8 nano model (small and fast)
model = YOLO('yolov8n.pt')  # make sure you have yolov8n.pt

current_detections = []

def generate_frames():
    global current_detections

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break

        # YOLO inference (pass BGR frame)
        results = model.predict(source=frame, imgsz=416, conf=0.5, verbose=False)

        # Grab first result
        result = results[0]

        temp_detections = []

        if result.boxes is not None:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                label = model.names[cls_id]
                temp_detections.append(label)

                # Draw box
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, label, (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        current_detections = temp_detections

        # Encode frame for MJPEG stream
        success, buffer = cv2.imencode('.jpg', frame)
        if not success:
            continue

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def print_detections():
    while True:
        time.sleep(5)
        if current_detections:
            print(f"[Detected Objects] {set(current_detections)}")
        else:
            print("[Detected Objects] None")

# Start detections logger
threading.Thread(target=print_detections, daemon=True).start()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
