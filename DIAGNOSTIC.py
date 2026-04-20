import os
# Suppress TensorFlow logging and oneDNN warnings before any TF imports happen anywhere
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import sys
import subprocess
import socket

def check_port(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def run_command(cmd):
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout.strip(), result.stderr.strip()
    except Exception as e:
        return "", str(e)

print("=== PhytoCare Deep Diagnostic ===")

# 1. Python Check
print(f"\n[Python] Version: {sys.version}")
print(f"[Python] Executable: {sys.executable}")

# 2. Dependencies Check
print("\n[Dependencies] Checking major packages...")
for pkg in ['fastapi', 'uvicorn', 'tensorflow', 'PIL', 'numpy']:
    try:
        __import__(pkg if pkg != 'PIL' else 'PIL.Image')
        print(f"  - {pkg}: OK")
    except ImportError:
        print(f"  - {pkg}: MISSING")

# 3. File System Check
print("\n[File System] Checking critical files...")
files = [
    'backend/main.py',
    'backend/model/potato_model.h5',
    'frontend/package.json',
    'frontend/vite.config.js'
]
for f in files:
    exists = os.path.exists(f)
    print(f"  - {f}: {'OK' if exists else 'MISSING'}")
    if exists and f.endswith('.h5'):
        print(f"    Size: {os.path.getsize(f) / 1024 / 1024:.2f} MB")

# 4. Port Check
print("\n[Ports] Checking availability...")
for port in [8000, 5173]:
    in_use = check_port(port)
    print(f"  - Port {port}: {'IN USE (Potential Conflict)' if in_use else 'FREE'}")

# 5. Node Check
print("\n[Node.js] Checking version...")
node_v, node_err = run_command('node -v')
npm_v, npm_err = run_command('npm -v')
print(f"  - Node: {node_v if node_v else 'NOT FOUND'}")
print(f"  - npm: {npm_v if npm_v else 'NOT FOUND'}")

print("\n=== End of Diagnostic ===")
input("Press Enter to close...")
