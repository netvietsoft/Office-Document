import subprocess
import time

ADB = r"C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
DEV = "192.168.1.3:40333"

def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    return p.stdout.strip(), p.stderr.strip()

def main():
    # 1. Tap Back button (top left arrow) at (70, 140)
    print("Tapping Back button in DocumentViewerScreen...")
    run([ADB, "-s", DEV, "shell", "input", "tap", "70", "140"])
    time.sleep(2)

    # 2. Capture Home screen
    print("Capturing Home screen...")
    run([ADB, "-s", DEV, "shell", "screencap", "-p", "/sdcard/screen_home_live.png"])
    run([ADB, "-s", DEV, "pull", "/sdcard/screen_home_live.png", "scripts/screen_home_live.png"])

    # 3. Tap on second document card (Legal Contract PDF or Financial Model)
    # On Home screen, scroll down slightly or tap around Y=1450, X=500
    print("Tapping on second document card...")
    run([ADB, "-s", DEV, "shell", "input", "tap", "500", "1450"])
    time.sleep(3)

    # 4. Capture viewer for second document
    print("Capturing second document viewer...")
    run([ADB, "-s", DEV, "shell", "screencap", "-p", "/sdcard/screen_viewer_doc2.png"])
    run([ADB, "-s", DEV, "pull", "/sdcard/screen_viewer_doc2.png", "scripts/screen_viewer_doc2.png"])

    print("Navigation test completed!")

if __name__ == "__main__":
    main()
