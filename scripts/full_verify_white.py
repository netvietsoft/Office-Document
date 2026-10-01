import subprocess
import time
import os

ADB = r"C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
DEVICE = "192.168.1.3:40333"

def connect():
    subprocess.run([ADB, "connect", DEVICE], capture_output=True, text=True)
    time.sleep(1)

def run_adb(args):
    cmd = [ADB, "-s", DEVICE] + args
    res = subprocess.run(cmd, capture_output=True, text=True)
    return res.stdout.strip()

def tap(x, y):
    print(f"Tapping ({x}, {y})...")
    run_adb(["shell", "input", "tap", str(x), str(y)])

def screencap(filename):
    dest_path = os.path.join("scripts", filename)
    run_adb(["shell", "screencap", "-p", f"/sdcard/{filename}"])
    subprocess.run([ADB, "-s", DEVICE, "pull", f"/sdcard/{filename}", dest_path], capture_output=True)
    print(f"Saved {dest_path}")

def main():
    connect()

    # 1. Tap on Merge PDF tool in grid (x=730, y=730)
    print("Opening Merge PDF tool...")
    tap(730, 730)
    time.sleep(2)
    screencap("verify_picker_white.png")

    # 2. Select 2 files in the picker
    print("Selecting 2 files in picker...")
    tap(540, 1050)
    time.sleep(1)
    tap(540, 1200)
    time.sleep(1)
    screencap("verify_selected_files_white.png")

    # 3. Tap Continue button (x=800, y=2110)
    print("Tapping Continue button...")
    tap(800, 2110)
    time.sleep(2)
    screencap("verify_config_white.png")

    # 4. Tap Start Processing (x=540, y=2110)
    print("Tapping Start Processing button...")
    tap(540, 2110)
    time.sleep(4.0)
    screencap("verify_final_popup_white.png")

    print("ALL STEPS COMPLETED!")

if __name__ == "__main__":
    main()
