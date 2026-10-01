import subprocess
import time
import sys

ADB = r"C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
PKG = "com.officedocument.word.docx.xlsx.viewer"
ACT = "com.nextaitechnology.officedocument.feature.main.MainActivity"

def run_cmd(cmd):
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    return res.stdout.strip(), res.stderr.strip()

def get_target_device():
    run_cmd([ADB, "start-server"])
    for attempt in range(12):
        time.sleep(1)
        out, err = run_cmd([ADB, "devices", "-l"])
        for line in out.splitlines():
            if ("SM_A507FN" in line or "a50s" in line) and "device" in line:
                device_id = line.split()[0]
                return device_id
    # Fallback to any device
    out, err = run_cmd([ADB, "devices"])
    for line in out.splitlines():
        if "\tdevice" in line:
            return line.split()[0]
    return None

def main():
    device = get_target_device()
    print("Found device:", device)
    if not device:
        print("No device found!")
        sys.exit(1)

    # Launch app
    print("Starting app...")
    out, err = run_cmd([ADB, "-s", device, "shell", "am", "start", "-a", "android.intent.action.MAIN", "-c", "android.intent.category.LAUNCHER", "-n", f"{PKG}/{ACT}", "-f", "0x10200000"])
    print("am start:", out, err)
    time.sleep(4)

    # Check focus
    out, err = run_cmd([ADB, "-s", device, "shell", "dumpsys", "window", "displays"])
    focus = [l.strip() for l in out.splitlines() if "mCurrentFocus" in l or "mFocusedApp" in l]
    print("Focus:", focus)

    # Capture Home
    print("Capturing Home...")
    run_cmd([ADB, "-s", device, "shell", "screencap", "-p", "/sdcard/screen_home_en.png"])
    run_cmd([ADB, "-s", device, "pull", "/sdcard/screen_home_en.png", "scripts/screen_home_en.png"])

    # Tap Files tab (324, 1990)
    print("Tapping Files tab...")
    run_cmd([ADB, "-s", device, "shell", "input", "tap", "324", "1990"])
    time.sleep(2)
    run_cmd([ADB, "-s", device, "shell", "screencap", "-p", "/sdcard/screen_files_en.png"])
    run_cmd([ADB, "-s", device, "pull", "/sdcard/screen_files_en.png", "scripts/screen_files_en.png"])

    # Tap AI Chat tab (756, 1990)
    print("Tapping AI Chat tab...")
    run_cmd([ADB, "-s", device, "shell", "input", "tap", "756", "1990"])
    time.sleep(2)
    run_cmd([ADB, "-s", device, "shell", "screencap", "-p", "/sdcard/screen_aichat_en.png"])
    run_cmd([ADB, "-s", device, "pull", "/sdcard/screen_aichat_en.png", "scripts/screen_aichat_en.png"])

    # Tap Settings tab (972, 1990)
    print("Tapping Settings tab...")
    run_cmd([ADB, "-s", device, "shell", "input", "tap", "972", "1990"])
    time.sleep(2)
    run_cmd([ADB, "-s", device, "shell", "screencap", "-p", "/sdcard/screen_settings_en.png"])
    run_cmd([ADB, "-s", device, "pull", "/sdcard/screen_settings_en.png", "scripts/screen_settings_en.png"])

    print("ALL DONE!")

if __name__ == "__main__":
    main()
