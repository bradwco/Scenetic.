from flask import Flask, Response, request, jsonify
import threading
import time
import cv2
import serial
from ultralytics import YOLO

app = Flask(__name__)

# 🔥 Update this if Pi's IP changes!
CAMERA_STREAM_URL = "tcp://192.168.137.83:8888"
cap = cv2.VideoCapture(CAMERA_STREAM_URL)

# Setup Serial for Arduino
try:
    arduino = serial.Serial(port='COM10', baudrate=9600, timeout=1)
    time.sleep(2)  # wait for Arduino reset
except:
    arduino = None
    print("⚠️ Arduino not connected!")

# Load YOLOv8 nano model (small and fast)
model = YOLO('yolov8n.pt')  

current_detections = []

def generate_frames():
    global current_detections

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break

        results = model.predict(source=frame, imgsz=416, conf=0.5, verbose=False)
        result = results[0]

        temp_detections = []

        if result.boxes is not None:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                label = model.names[cls_id]
                temp_detections.append(label)

                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, label, (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        current_detections = temp_detections

        success, buffer = cv2.imencode('.jpg', frame)
        if not success:
            continue

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start-sequence', methods=['POST'])
def start_sequence():
    print("🔥🔥🔥 Received /start-sequence POST 🔥🔥🔥")  # <- ADD THIS
    if arduino is None:
        return jsonify({"error": "Arduino not connected"}), 500
    
    try:
        arduino.write(b'1')  # Send signal '1' to Arduino
        return jsonify({"message": "Command sent to Arduino!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
