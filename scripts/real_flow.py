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

    # 1. Start App
    print("Bringing app to front...")
    run_adb(["shell", "am", "start", "-n", "com.officedocument.word.docx.xlsx.viewer/com.nextaitechnology.officedocument.feature.main.MainActivity"])
    time.sleep(2)
    screencap("real_step1_app.png")

    # 2. Tap on PDF Tools (x=655, y=580)
    print("Tapping PDF Tools on Home...")
    tap(655, 580)
    time.sleep(2)
    screencap("real_step2_pdftools.png")

    # 3. Tap on Merge PDF (x=730, y=730)
    print("Tapping Merge PDF card...")
    tap(730, 730)
    time.sleep(2)
    screencap("real_step3_picker.png")

    # 4. In Picker: Select 2 files
    # Local files list starts below search box (around y=1050 and y=1200)
    print("Selecting 2 files in picker...")
    tap(540, 1050)
    time.sleep(1)
    tap(540, 1200)
    time.sleep(1)
    screencap("real_step4_selected.png")

    # 5. Tap Continue button in picker bottom bar (x=880, y=2180 or x=850, y=2050)
    # Let's inspect real_step4_selected.png or tap continue
    print("Tapping Continue...")
    tap(880, 2050)
    time.sleep(2)
    screencap("real_step5_config.png")

    # 6. Tap Start Processing (x=540, y=2050)
    print("Tapping Start Processing...")
    tap(540, 2050)
    time.sleep(3.5)
    screencap("real_step6_popup.png")

    print("ALL DONE!")

if __name__ == "__main__":
    main()
