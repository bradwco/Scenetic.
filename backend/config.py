# config.py
import os

# Camera stream URL (UPDATE LATER)
CAMERA_STREAM_URL = "tcp://192.168.137.1:8888"

# Directory for saving snapshots 
SNAPSHOT_DIR = os.path.join(os.path.dirname(__file__), "video_hardware", "snapshots")

# Arduino settings
ARDUINO_SETTINGS = {
    "port": "COM10",
    "baudrate": 9600,
    "timeout": 1
}
