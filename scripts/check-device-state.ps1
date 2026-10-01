$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$PackageName = "com.officedocument.word.docx.xlsx.viewer"
$MainActivity = "com.nextaitechnology.officedocument.feature.main.MainActivity"

& $Adb start-server

$targetDevice = ""
for ($i = 0; $i -lt 10; $i++) {
    Start-Sleep -Seconds 1
    $devLines = & $Adb devices -l
    foreach ($line in $devLines) {
        if ($line -match "SM_A507FN" -or $line -match "a50s") {
            $targetDevice = ($line -split "\s+")[0]
            break
        }
    }
    if ($targetDevice -ne "") { break }
}

if ($targetDevice -eq "") {
    Write-Host "Device not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Target Device: $targetDevice" -ForegroundColor Cyan

# 1. Wake screen up and dismiss keyguard if locked
Write-Host "Waking device and unlocking screen..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input keyevent 224 # KEYCODE_WAKEUP
& $Adb -s $targetDevice shell wm dismiss-keyguard

# 2. Check current focused window
$focus = & $Adb -s $targetDevice shell dumpsys window | Select-String -Pattern "mCurrentFocus", "mFocusedApp"
Write-Host "Current Focus:`n$focus" -ForegroundColor Yellow

# 3. Bring app to foreground
Write-Host "Starting Activity..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell am start -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -n "$PackageName/$MainActivity"

Start-Sleep -Seconds 3

# 4. Check focus again
$focusAfter = & $Adb -s $targetDevice shell dumpsys window | Select-String -Pattern "mCurrentFocus", "mFocusedApp"
Write-Host "Focus After Launch:`n$focusAfter" -ForegroundColor Green

# 5. Capture screenshot
& $Adb -s $targetDevice shell screencap -p /sdcard/live_screen2.png
& $Adb -s $targetDevice pull /sdcard/live_screen2.png live_test_screen_focused.png

# 6. Check logcat
$logs = & $Adb -s $targetDevice logcat -d -t 100 | Select-String -Pattern "OfficeApp", "MainActivity", "AndroidRuntime", "com.officedocument"
Write-Host "Recent app logs:`n$logs" -ForegroundColor Gray
