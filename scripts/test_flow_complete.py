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

    # Launch app
    print("Launching Office Document App...")
    run_adb(["shell", "am", "start", "-n", "com.officedocument.word.docx.xlsx.viewer/com.nextaitechnology.officedocument.feature.main.MainActivity"])
    time.sleep(2)

    # Check if there is an ad banner and click "Continue to app"
    tap(850, 60)
    time.sleep(2)
    screencap("test_1_main.png")

    # Navigate to PDF Tools: tap (655, 580)
    print("Opening PDF Tools...")
    tap(655, 580)
    time.sleep(2)
    screencap("test_2_tools.png")

    # Tap Merge PDF: (730, 730)
    print("Opening Merge PDF...")
    tap(730, 730)
    time.sleep(2)
    screencap("test_3_picker.png")

    # Select 2 files in picker list (they are around x=540, y=1050 and x=540, y=1200)
    print("Selecting 2 files...")
    tap(540, 1050)
    time.sleep(1)
    tap(540, 1200)
    time.sleep(1)
    screencap("test_4_selected_files.png")

    # Tap Continue button (in picker bottom bar, around x=880, y=2050 or y=2110)
    print("Tapping Continue...")
    tap(880, 2050)
    time.sleep(2)
    screencap("test_5_config.png")

    # Tap Start Processing (center of bottom bar, around x=540, y=2050 or y=2110)
    print("Tapping Start Processing...")
    tap(540, 2050)
    time.sleep(4.0)
    screencap("test_6_popup.png")

    print("DONE SCRIPT!")

if __name__ == "__main__":
    main()
