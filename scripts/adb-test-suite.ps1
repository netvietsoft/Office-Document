# Automated ADB Test Suite for NextAI Office Suite on connected Android device/emulator.

param(
    [string]$AdbPath = "adb",
    [string]$PackageName = "com.nextaitechnology.officedocument",
    [string]$ApkPath = "CONVERT/Android/app/build/outputs/apk/debug/app-debug.apk"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "NextAI Office Suite - Automated ADB Testing Suite" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check ADB Devices
Write-Host "[1/6] Checking connected devices via ADB..." -ForegroundColor Yellow
$devices = & $AdbPath devices
Write-Host $devices

# 2. Install APK if built
if (Test-Path $ApkPath) {
    Write-Host "[2/6] Installing APK ($ApkPath)..." -ForegroundColor Yellow
    & $AdbPath install -r $ApkPath
} else {
    Write-Host "[2/6] APK not built yet. Build first with: ./gradlew assembleDebug" -ForegroundColor DarkYellow
}

# 3. Grant Permissions
Write-Host "[3/6] Granting Camera and Notification permissions..." -ForegroundColor Yellow
& $AdbPath shell pm grant $PackageName android.permission.CAMERA 2>$null
& $AdbPath shell pm grant $PackageName android.permission.POST_NOTIFICATIONS 2>$null

# 4. Launch Main Activity
Write-Host "[4/6] Launching NextAI Office Suite Main Activity..." -ForegroundColor Yellow
& $AdbPath shell am start -n "$PackageName/.feature.main.MainActivity"

Start-Sleep -Seconds 3

# 5. Check Logcat for fatal crashes
Write-Host "[5/6] Scanning logcat for fatal exceptions..." -ForegroundColor Yellow
$crashes = & $AdbPath logcat -d | Select-String -Pattern "FATAL EXCEPTION", "com.nextaitechnology" | Select-Object -First 20

if ($crashes) {
    Write-Host "Warning: Found exception patterns in logcat:" -ForegroundColor Red
    $crashes | ForEach-Object { Write-Host $_.Line -ForegroundColor DarkRed }
} else {
    Write-Host "No Fatal Exceptions found!" -ForegroundColor Green
}

# 6. Complete
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Automated ADB test execution complete!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
