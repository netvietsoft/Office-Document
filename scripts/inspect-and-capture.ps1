$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$PackageName = "com.officedocument.word.docx.xlsx.viewer"
$MainActivity = "com.nextaitechnology.officedocument.feature.main.MainActivity"

& $Adb start-server
$targetDevice = ""
for ($i = 0; $i -lt 10; $i++) {
    Start-Sleep -Seconds 1
    $devLines = & $Adb devices -l
    foreach ($line in $devLines) {
        if ($line -match "device\s+" -or $line -match "device$") {
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

Write-Host "Device: $targetDevice" -ForegroundColor Green

# Check current focus
$focus = & $Adb -s $targetDevice shell "dumpsys window | grep -E 'mCurrentFocus|mFocusedApp'"
Write-Host "Focus: $focus"

# If not focused on our app, launch it
Write-Host "Starting app..."
& $Adb -s $targetDevice shell am start -n "$PackageName/$MainActivity"
Start-Sleep -Seconds 3

# Check logcat for any crashes
Write-Host "Checking logcat for fatal exceptions..."
$crashes = & $Adb -s $targetDevice shell "logcat -d -t 100 *:E" | Select-String -Pattern "FATAL|AndroidRuntime|officedocument" -Context 0,2
if ($crashes) {
    Write-Host "Crashes found:" -ForegroundColor Red
    $crashes | Out-String | Write-Host
} else {
    Write-Host "No crash detected in recent logs." -ForegroundColor Green
}

# Capture screen
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_app_state.png
& $Adb -s $targetDevice pull /sdcard/screen_app_state.png scripts/screen_app_state.png
Write-Host "Captured scripts/screen_app_state.png" -ForegroundColor Green
