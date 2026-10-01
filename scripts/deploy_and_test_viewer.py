import subprocess
import time
import sys
import os

ADB = r"C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
PKG = "com.officedocument.word.docx.xlsx.viewer"
ACT = "com.nextaitechnology.officedocument.feature.main.MainActivity"
APK = r"CONVERT\Android\app\build\outputs\apk\debug\app-debug.apk"

def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    return p.stdout.strip(), p.stderr.strip()

def get_device():
    run([ADB, "connect", "192.168.1.3:40333"])
    time.sleep(2)
    out, _ = run([ADB, "devices", "-l"])
    print("Devices output:\n", out)
    for line in out.splitlines():
        if "device" in line and not line.startswith("List"):
            dev_id = line.split()[0]
            print(f"Using device: {dev_id}")
            return dev_id
    return None

def main():
    device = get_device()
    if not device:
        print("Error: Could not connect to device!")
        sys.exit(1)

    # 1. Install APK
    print(f"Installing {APK} on {device}...")
    out, err = run([ADB, "-s", device, "install", "-r", APK])
    print("Install result:", out, err)

    # 2. Launch MainActivity
    print("Starting app...")
    run([ADB, "-s", device, "shell", "am", "start", "-n", f"{PKG}/{ACT}", "-a", "android.intent.action.MAIN", "-c", "android.intent.category.LAUNCHER", "-f", "0x10200000"])
    time.sleep(4)

    # 3. Check current focus
    out, _ = run([ADB, "-s", device, "shell", "dumpsys", "window"])
    for line in out.splitlines():
        if "mCurrentFocus" in line:
            print("Current focus:", line.strip())

    # 4. Capture Home Screen
    print("Capturing Home screen...")
    run([ADB, "-s", device, "shell", "screencap", "-p", "/sdcard/screen_home_verified.png"])
    run([ADB, "-s", device, "pull", "/sdcard/screen_home_verified.png", "scripts/screen_home_verified.png"])

    # 5. Tap on the first document card in Document Catalog on Home Screen
    # Typically around Y=1150-1300, X=500
    # Let's inspect uiautomator dump to find exact coordinate of the document card
    print("Dumping UI hierarchy...")
    run([ADB, "-s", device, "shell", "uiautomator", "dump", "/sdcard/window_dump.xml"])
    run([ADB, "-s", device, "pull", "/sdcard/window_dump.xml", "scripts/window_dump.xml"])

    # Tap on document card
    print("Tapping on first document card...")
    # Document card is below the filter chips, around X=500, Y=1250
    run([ADB, "-s", device, "shell", "input", "tap", "500", "1250"])
    time.sleep(3)

    # 6. Capture Document Viewer Screen
    print("Capturing Document Viewer Screen...")
    run([ADB, "-s", device, "shell", "screencap", "-p", "/sdcard/screen_viewer_real.png"])
    run([ADB, "-s", device, "pull", "/sdcard/screen_viewer_real.png", "scripts/screen_viewer_real.png"])

    # 7. Check focus again
    out, _ = run([ADB, "-s", device, "shell", "dumpsys", "window"])
    for line in out.splitlines():
        if "mCurrentFocus" in line:
            print("Current focus after opening document:", line.strip())

    print("Done! Screenshots saved to scripts/screen_home_verified.png and scripts/screen_viewer_real.png")

if __name__ == "__main__":
    main()
