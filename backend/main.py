import subprocess
import os

gemini_path = os.path.join("gemini", "app.py")  
video_path = os.path.join("video hardware", "video_api.py")

# Start both scripts
p1 = subprocess.Popen(["python", gemini_path])
p2 = subprocess.Popen(["python", video_path])

p1.wait()
p2.wait()
