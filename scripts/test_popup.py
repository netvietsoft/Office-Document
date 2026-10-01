import subprocess
import time
import os

ADB = r"C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
DEVICE = "192.168.1.3:40333"

def connect():
    subprocess.run([ADB, "connect", DEVICE], capture_output=True)
    time.sleep(1)

def run_adb(args):
    cmd = [ADB, "-s", DEVICE] + args
    res = subprocess.run(cmd, capture_output=True, text=True)
    return res.stdout.strip()

def tap(x, y):
    print(f"Tapping ({x}, {y})...")
    run_adb(["shell", "input", "tap", str(x), str(y)])

def screencap(dest):
    dest_path = dest.replace('/', os.sep)
    run_adb(["shell", "screencap", "-p", "/sdcard/temp.png"])
    subprocess.run([ADB, "-s", DEVICE, "pull", "/sdcard/temp.png", dest_path], capture_output=True)
    print(f"Saved {dest_path}")

def main():
    connect()
    # Tap Continue button
    tap(800, 2110)
    time.sleep(1.5)
    screencap("scripts/config_sheet.png")
    
    # Tap Start Processing
    tap(540, 2110)
    time.sleep(3.0)
    screencap("scripts/final_popup.png")
    print("FINISHED ALL STEPS!")

if __name__ == "__main__":
    main()
