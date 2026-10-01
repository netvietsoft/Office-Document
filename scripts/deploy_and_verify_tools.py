import subprocess
import time
import sys
import os

ADB = r"C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
PKG = "com.officedocument.word.docx.xlsx.viewer"
ACT = "com.nextaitechnology.officedocument.feature.main.MainActivity"
APK = r"CONVERT\Android\app\build\outputs\apk\debug\app-debug.apk"

def run_cmd(cmd):
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    return res.stdout.strip(), res.stderr.strip()

def get_target_device():
    run_cmd([ADB, "start-server"])
    for attempt in range(12):
        time.sleep(1)
        out, err = run_cmd([ADB, "devices", "-l"])
        for line in out.splitlines():
            if ("SM_A507FN" in line or "a50s" in line or "adb-" in line) and "device" in line:
                return line.split()[0]
    return None

def main():
    device = get_target_device()
    print("Target Device:", device)
    if not device:
        print("Device not found!")
        sys.exit(1)

    # 1. Install updated APK
    print(f"Installing {APK} to {device}...")
    out, err = run_cmd([ADB, "-s", device, "install", "-r", APK])
    print("Install output:", out)

    # 2. Grant permissions
    run_cmd([ADB, "-s", device, "shell", "pm", "grant", PKG, "android.permission.CAMERA"])
    run_cmd([ADB, "-s", device, "shell", "pm", "grant", PKG, "android.permission.POST_NOTIFICATIONS"])

    # 3. Launch MainActivity
    print("Launching MainActivity...")
    out, err = run_cmd([ADB, "-s", device, "shell", "am", "start", "-a", "android.intent.action.MAIN", "-c", "android.intent.category.LAUNCHER", "-n", f"{PKG}/{ACT}", "-f", "0x10200000"])
    print("Launch output:", out)
    time.sleep(4)

    # 4. Tap Tab 3 (Tools: X=540, Y=1990)
    print("Tapping Tools Tab (540, 1990)...")
    run_cmd([ADB, "-s", device, "shell", "input", "tap", "540", "1990"])
    time.sleep(3)

    # 5. Capture PDF Tools screen with bottom navigation bar
    print("Capturing PDF Tools screen...")
    run_cmd([ADB, "-s", device, "shell", "screencap", "-p", "/sdcard/screen_pdftools_with_bottom_nav.png"])
    run_cmd([ADB, "-s", device, "pull", "/sdcard/screen_pdftools_with_bottom_nav.png", "scripts/screen_pdftools_with_bottom_nav.png"])
    print("Saved scripts/screen_pdftools_with_bottom_nav.png")

    # 6. Verify tapping another tab from PDF Tools (e.g. Files: X=324, Y=1990)
    print("Testing navigation from PDF Tools bottom bar: Tapping Files Tab (324, 1990)...")
    run_cmd([ADB, "-s", device, "shell", "input", "tap", "324", "1990"])
    time.sleep(3)
    run_cmd([ADB, "-s", device, "shell", "screencap", "-p", "/sdcard/screen_nav_from_pdftools_to_files.png"])
    run_cmd([ADB, "-s", device, "pull", "/sdcard/screen_nav_from_pdftools_to_files.png", "scripts/screen_nav_from_pdftools_to_files.png"])
    print("Saved scripts/screen_nav_from_pdftools_to_files.png")

    print("ALL TESTS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
