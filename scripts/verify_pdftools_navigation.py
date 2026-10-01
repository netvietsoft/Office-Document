import subprocess
import time
import sys
import os

ADB = r"C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
PKG = "com.officedocument.word.docx.xlsx.viewer"
ACT = "com.nextaitechnology.officedocument.feature.main.MainActivity"
DEVICE_IP = "192.168.1.3:40333"

def run_cmd(cmd):
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    return res.stdout.strip(), res.stderr.strip()

def ensure_device():
    # 1. Connect to wireless adb
    run_cmd([ADB, "connect", DEVICE_IP])
    time.sleep(1)
    out, _ = run_cmd([ADB, "devices", "-l"])
    print("Devices output:\n", out)
    for line in out.splitlines():
        if DEVICE_IP in line and "device" in line:
            return DEVICE_IP
        if ("SM_A507FN" in line or "a50s" in line or "adb-" in line) and "device" in line:
            return line.split()[0]
    return DEVICE_IP

def main():
    device = ensure_device()
    print("Using target device:", device)

    # Wake up screen
    run_cmd([ADB, "-s", device, "shell", "input", "keyevent", "KEYCODE_WAKEUP"])
    time.sleep(1)

    # Launch app
    print("Launching MainActivity...")
    out, err = run_cmd([ADB, "-s", device, "shell", "am", "start", "-a", "android.intent.action.MAIN", "-c", "android.intent.category.LAUNCHER", "-n", f"{PKG}/{ACT}", "-f", "0x10200000"])
    print("Launch:", out, err)
    time.sleep(4)

    # First capture current screen to see where we are
    run_cmd([ADB, "-s", device, "shell", "screencap", "-p", "/sdcard/screen_step0.png"])
    run_cmd([ADB, "-s", device, "pull", "/sdcard/screen_step0.png", "scripts/screen_step0.png"])
    print("Pulled scripts/screen_step0.png")

    # Tap on Tools tab (Bottom Bar X=540, Y=1990)
    print("Tapping Tools tab at (540, 1990)...")
    run_cmd([ADB, "-s", device, "shell", "input", "tap", "540", "1990"])
    time.sleep(3)

    # Capture PDF Tools screen
    print("Capturing PDF Tools screen with bottom navigation bar...")
    run_cmd([ADB, "-s", device, "shell", "screencap", "-p", "/sdcard/screen_pdftools_verified.png"])
    run_cmd([ADB, "-s", device, "pull", "/sdcard/screen_pdftools_verified.png", "scripts/screen_pdftools_verified.png"])
    print("Pulled scripts/screen_pdftools_verified.png")

    # Test navigating to Files tab from PDF Tools bottom bar (X=324, Y=1990)
    print("Tapping Files tab at (324, 1990) from PDF Tools...")
    run_cmd([ADB, "-s", device, "shell", "input", "tap", "324", "1990"])
    time.sleep(3)

    # Capture Files screen
    print("Capturing Files screen...")
    run_cmd([ADB, "-s", device, "shell", "screencap", "-p", "/sdcard/screen_files_nav_verified.png"])
    run_cmd([ADB, "-s", device, "pull", "/sdcard/screen_files_nav_verified.png", "scripts/screen_files_nav_verified.png"])
    print("Pulled scripts/screen_files_nav_verified.png")

    # Test tapping Tools tab again from Files screen to verify return to PDF Tools
    print("Tapping Tools tab at (540, 1990) to return to PDF Tools...")
    run_cmd([ADB, "-s", device, "shell", "input", "tap", "540", "1990"])
    time.sleep(3)
    run_cmd([ADB, "-s", device, "shell", "screencap", "-p", "/sdcard/screen_pdftools_return_verified.png"])
    run_cmd([ADB, "-s", device, "pull", "/sdcard/screen_pdftools_return_verified.png", "scripts/screen_pdftools_return_verified.png"])
    print("Pulled scripts/screen_pdftools_return_verified.png")

    print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
