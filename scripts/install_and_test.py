import subprocess
import time
import os

ADB = r"C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
DEVICE = "192.168.1.3:40333"

def connect():
    res = subprocess.run([ADB, "connect", DEVICE], capture_output=True, text=True)
    print("Connect output:", res.stdout.strip())
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

    # Launch Office Document app correctly
    print("Launching Office Document App...")
    run_adb(["shell", "am", "start", "-n", "com.officedocument.word.docx.xlsx.viewer/com.nextaitechnology.officedocument.feature.main.MainActivity"])
    time.sleep(3)
    screencap("scripts/home_screen.png")

    # Navigate to Tools tab (approx x=540, y=2180)
    print("Navigating to Tools tab...")
    tap(540, 2180)
    time.sleep(2)
    screencap("scripts/verify_pdftools.png")

    # Tap on Merge PDF tool (First tool in grid: approx x=270, y=820)
    print("Tapping Merge PDF tool...")
    tap(270, 820)
    time.sleep(2)
    screencap("scripts/picker_screen.png")

    # Select two files in picker (tap first row approx x=540, y=1050 and second row approx x=540, y=1200)
    print("Selecting files in picker...")
    tap(540, 1050)
    time.sleep(1)
    tap(540, 1200)
    time.sleep(1)
    screencap("scripts/selected_files.png")

    # Tap Continue button (bottom right approx x=800, y=2110)
    print("Tapping Continue...")
    tap(800, 2110)
    time.sleep(2)
    screencap("scripts/config_sheet.png")

    # Tap Start Processing (bottom center approx x=540, y=2110)
    print("Tapping Start Processing...")
    tap(540, 2110)
    time.sleep(4.0)
    screencap("scripts/final_popup.png")

    print("ALL DONE!")

if __name__ == "__main__":
    main()
