$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$PackageName = "com.officedocument.word.docx.xlsx.viewer"
$MainActivity = "com.nextaitechnology.officedocument.feature.main.MainActivity"
$targetDevice = "adb-R58MA581ZZA-n4XnSK._adb-tls-connect._tcp"

Write-Host "Target Device: $targetDevice" -ForegroundColor Green

# 1. Bring app to front
Write-Host "Bringing MainActivity to front..."
& $Adb -s $targetDevice shell input keyevent 4
Start-Sleep -Milliseconds 400
& $Adb -s $targetDevice shell am start -n "$PackageName/$MainActivity" --activity-clear-top
Start-Sleep -Seconds 2

# Capture Home
Write-Host "Capturing Home Screen..."
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_home_verified.png
& $Adb -s $targetDevice pull /sdcard/screen_home_verified.png scripts/screen_home_verified.png

# 2. Tap Files Tab (324, 1990)
Write-Host "Tapping Files Tab (324, 1990)..."
& $Adb -s $targetDevice shell input tap 324 1990
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_files_verified.png
& $Adb -s $targetDevice pull /sdcard/screen_files_verified.png scripts/screen_files_verified.png

# 3. Tap Tools Tab (540, 1990)
Write-Host "Tapping Tools Tab (540, 1990)..."
& $Adb -s $targetDevice shell input tap 540 1990
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_tools_verified.png
& $Adb -s $targetDevice pull /sdcard/screen_tools_verified.png scripts/screen_tools_verified.png

# 4. Tap AI Chat Tab (756, 1990)
Write-Host "Tapping AI Chat Tab (756, 1990)..."
& $Adb -s $targetDevice shell input tap 756 1990
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_aichat_verified.png
& $Adb -s $targetDevice pull /sdcard/screen_aichat_verified.png scripts/screen_aichat_verified.png

# 5. Tap Settings Tab (972, 1990)
Write-Host "Tapping Settings Tab (972, 1990)..."
& $Adb -s $targetDevice shell input tap 972 1990
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_settings_verified.png
& $Adb -s $targetDevice pull /sdcard/screen_settings_verified.png scripts/screen_settings_verified.png

Write-Host "ALL SCREENS CAPTURED!" -ForegroundColor Cyan
