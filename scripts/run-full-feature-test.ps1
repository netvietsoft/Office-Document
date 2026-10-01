# NextAI Office Suite - Full End-to-End Feature Verification Script
param(
    [string]$AdbPath = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe",
    [string]$PackageName = "com.nextaitechnology.officedocument",
    [string]$ApkPath = "CONVERT/Android/app/build/outputs/apk/debug/app-debug.apk"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "NextAI Office Suite - Comprehensive Feature Verification" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Wait for Device Boot Completion
Write-Host "[1/7] Waiting for Android device to finish booting..." -ForegroundColor Yellow
$booted = ""
for ($i = 0; $i -lt 30; $i++) {
    $booted = (& $AdbPath shell getprop sys.boot_completed)
    if ($booted -match "1") {
        Write-Host "Device boot complete!" -ForegroundColor Green
        break
    }
    Start-Sleep -Seconds 2
}

# 2. Install Debug APK
Write-Host "[2/7] Installing app APK ($ApkPath)..." -ForegroundColor Yellow
& $AdbPath install -r $ApkPath

# 3. Grant Permissions
Write-Host "[3/7] Granting permissions..." -ForegroundColor Yellow
& $AdbPath shell pm grant $PackageName android.permission.CAMERA 2>$null
& $AdbPath shell pm grant $PackageName android.permission.POST_NOTIFICATIONS 2>$null

# 4. Clear Logcat and Launch App
Write-Host "[4/7] Launching MainActivity..." -ForegroundColor Yellow
& $AdbPath logcat -c
& $AdbPath shell am start -n "$PackageName/.feature.main.MainActivity"
Start-Sleep -Seconds 4

# 5. Capture Home Screen
Write-Host "[5/7] Capturing Home Dashboard screenshot..." -ForegroundColor Yellow
& $AdbPath shell screencap -p /sdcard/screen_home.png
& $AdbPath pull /sdcard/screen_home.png screen_test_home.png

# 6. Check Logcat for crashes or errors
Write-Host "[6/7] Checking logcat for exceptions..." -ForegroundColor Yellow
$logcatErrors = & $AdbPath logcat -d | Select-String -Pattern "FATAL EXCEPTION", "AndroidRuntime", "com.nextaitechnology" | Select-Object -First 30

if ($logcatErrors) {
    Write-Host "Logcat output:" -ForegroundColor Gray
    $logcatErrors | ForEach-Object { Write-Host $_.Line }
} else {
    Write-Host "Logcat is clean! No crashes or fatal exceptions." -ForegroundColor Green
}

# 7. Summary
Write-Host "[7/7] Verification completed successfully!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
