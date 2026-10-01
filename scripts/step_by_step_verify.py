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

def back():
    print("Pressing BACK...")
    run_adb(["shell", "input", "keyevent", "BACK"])

def screencap(filename):
    dest_path = os.path.join("scripts", filename)
    run_adb(["shell", "screencap", "-p", f"/sdcard/{filename}"])
    subprocess.run([ADB, "-s", DEVICE, "pull", f"/sdcard/{filename}", dest_path], capture_output=True)
    print(f"Saved {dest_path}")

def main():
    connect()

    # Press BACK twice to ensure at home
    back()
    time.sleep(1)
    back()
    time.sleep(1)

    # 1. Tap on Tools Tab in bottom bar (x=540, y=2030)
    print("Tapping Tools Tab in Bottom Nav...")
    tap(540, 2030)
    time.sleep(2)
    screencap("step1_pdftools_grid.png")

    # 2. Tap Merge PDF card in grid (x=740, y=730)
    print("Tapping Merge PDF card...")
    tap(740, 730)
    time.sleep(2)
    screencap("step2_picker_screen.png")

    # 3. Select 2 files in picker list (x=540, y=750) and (x=540, y=880)
    print("Selecting 2 files...")
    tap(540, 750)
    time.sleep(1)
    tap(540, 880)
    time.sleep(1)
    screencap("step3_selected_files.png")

    # 4. Tap Continue button at bottom right (x=880, y=1950)
    print("Tapping Continue button...")
    tap(880, 1950)
    time.sleep(2)
    screencap("step4_config_sheet.png")

    # 5. Tap Start Processing button at bottom center (x=540, y=1950)
    print("Tapping Start Processing...")
    tap(540, 1950)
    time.sleep(3.5)
    screencap("step5_final_popup.png")

    print("ALL 5 STEPS COMPLETED!")

if __name__ == "__main__":
    main()
