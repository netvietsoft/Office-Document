# Automated device test script for language switching & screen verification
$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$PackageName = "com.officedocument.word.docx.xlsx.viewer"
$MainActivity = "com.nextaitechnology.officedocument.feature.main.MainActivity"

& $Adb start-server

$targetDevice = ""
for ($i = 0; $i -lt 12; $i++) {
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
    Write-Host "Physical test device not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Target Device: $targetDevice" -ForegroundColor Green

# 1. Bring app to foreground
Write-Host "Launching MainActivity..." -ForegroundColor Cyan
& $Adb -s $targetDevice shell am start -n "$PackageName/$MainActivity"
Start-Sleep -Seconds 2

# 2. Capture Home Screen in current language
Write-Host "Capturing initial Home screen..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_initial_home.png
& $Adb -s $targetDevice pull /sdcard/screen_initial_home.png scripts/screen_initial_home.png

# 3. Tap Settings Tab (Tab 4: X=945, Y=2150)
Write-Host "Navigating to Settings Tab..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input tap 945 2150
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_settings.png
& $Adb -s $targetDevice pull /sdcard/screen_settings.png scripts/screen_settings.png

# 4. Tap Language Row in Settings (around Y=420-480)
Write-Host "Tapping Language Selection row in Settings..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input tap 540 450
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_lang_dialog.png
& $Adb -s $targetDevice pull /sdcard/screen_lang_dialog.png scripts/screen_lang_dialog.png

# 5. Tap English option in Language Dialog (around Y=850)
Write-Host "Selecting English (English)..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input tap 540 850
Start-Sleep -Seconds 1

# 6. Tap Apply Button in Language Dialog (bottom right: X=800, Y=1450)
Write-Host "Tapping Apply button..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input tap 800 1450
Start-Sleep -Seconds 2

# 7. Tap Files Tab (Tab 2: X=405, Y=2150) - Specific focus of Chairman!
Write-Host "Navigating to Files Tab in English..." -ForegroundColor Cyan
& $Adb -s $targetDevice shell input tap 405 2150
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_files_en.png
& $Adb -s $targetDevice pull /sdcard/screen_files_en.png scripts/screen_files_en.png

# 8. Tap Home Tab (Tab 1: X=135, Y=2150)
Write-Host "Navigating to Home Tab in English..." -ForegroundColor Cyan
& $Adb -s $targetDevice shell input tap 135 2150
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_home_en.png
& $Adb -s $targetDevice pull /sdcard/screen_home_en.png scripts/screen_home_en.png

# 9. Tap Tools Tab (Tab 3: X=675, Y=2150)
Write-Host "Navigating to Tools Tab in English..." -ForegroundColor Cyan
& $Adb -s $targetDevice shell input tap 675 2150
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_tools_en.png
& $Adb -s $targetDevice pull /sdcard/screen_tools_en.png scripts/screen_tools_en.png

Write-Host "Verification test routine completed!" -ForegroundColor Green
