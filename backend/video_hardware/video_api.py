from flask import Flask, Response, request, jsonify, send_file
import threading
import time
import cv2
import serial
import os
import sys
from ultralytics import YOLO

# Allow importing config.py from backend root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import CAMERA_STREAM_URL, SNAPSHOT_DIR, ARDUINO_SETTINGS

app = Flask(__name__)

# Setup camera stream
cap = cv2.VideoCapture(CAMERA_STREAM_URL)

# Setup Serial for Arduino
try:
    arduino = serial.Serial(
        port=ARDUINO_SETTINGS["port"],
        baudrate=ARDUINO_SETTINGS["baudrate"],
        timeout=ARDUINO_SETTINGS["timeout"]
    )
    time.sleep(2)
except:
    arduino = None
    print("⚠️ Arduino not connected!")

# Load YOLOv8 nano model
model = YOLO('yolov8n.pt')

# Create snapshot directory if it doesn't exist
os.makedirs(SNAPSHOT_DIR, exist_ok=True)

# Track current detections
current_detections = []

def generate_frames():
    global current_detections

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break

        # Rotate and resize frame
        frame = cv2.rotate(frame, cv2.ROTATE_180)
        scale_percent = 80
        width = int(frame.shape[1] * scale_percent / 100)
        height = int(frame.shape[0] * scale_percent / 100)
        frame = cv2.resize(frame, (width, height), interpolation=cv2.INTER_AREA)

        # Predict
        results = model.predict(source=frame, imgsz=416, conf=0.5, verbose=False)
        result = results[0]

        temp_detections = []
        if result.boxes is not None:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                label = model.names[cls_id]
                confidence = float(box.conf[0])
                temp_detections.append(label)

                # Draw boxes
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f"{label} {confidence:.2f}", (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        current_detections = temp_detections

        # Save the latest frame
        latest_snapshot_path = os.path.join(SNAPSHOT_DIR, 'latest-snapshot.jpg')
        cv2.imwrite(latest_snapshot_path, frame)

        # Encode frame as JPEG for streaming
        success, buffer = cv2.imencode('.jpg', frame)
        if not success:
            continue

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

# --- Flask Routes ---

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start-sequence', methods=['POST'])
def start_sequence():
    print("🔥🔥🔥 Received /start-sequence POST 🔥🔥🔥")
    if arduino is None:
        return jsonify({"error": "Arduino not connected"}), 500
    try:
        arduino.write(b'1')
        return jsonify({"message": "Command sent to Arduino!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/latest-snapshot.jpg')
def latest_snapshot():
    try:
        latest_path = os.path.join(SNAPSHOT_DIR, 'latest-snapshot.jpg')
        if not os.path.exists(latest_path):
            return "No snapshot found", 404
        return send_file(latest_path, mimetype='image/jpeg')
    except Exception as e:
        print(f"🔥 Error serving latest snapshot: {e}")
        return "Error", 500

def print_detections():
    while True:
        time.sleep(5)
        if current_detections:
            print(f"[Detected Objects] {set(current_detections)}")
        else:
            print("[Detected Objects] None")

# Start printing detections in background
threading.Thread(target=print_detections, daemon=True).start()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
