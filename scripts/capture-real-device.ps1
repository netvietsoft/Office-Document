$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$PackageName = "com.officedocument.word.docx.xlsx.viewer"
$MainActivity = "com.nextaitechnology.officedocument.feature.main.MainActivity"

& $Adb start-server

$targetDevice = ""
for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Seconds 1
    $devLines = & $Adb devices -l
    foreach ($line in $devLines) {
        if ($line -match "SM_A507FN" -or $line -match "a50s" -or $line -match "adb-") {
            if ($line -match "device\s+" -or $line -match "device$") {
                $targetDevice = ($line -split "\s+")[0]
                break
            }
        }
    }
    if ($targetDevice -ne "") { break }
}

if ($targetDevice -eq "") {
    Write-Host "Device not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Target Device Found: $targetDevice" -ForegroundColor Green

# 1. Force start MainActivity to front
Write-Host "Launching Office Document MainActivity..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell am start -n "$PackageName/$MainActivity" --activity-clear-top
Start-Sleep -Seconds 4

# 2. Capture Home Screen
Write-Host "Capturing Home Screen..." -ForegroundColor Green
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_home_real.png
& $Adb -s $targetDevice pull /sdcard/screen_home_real.png scripts/screen_home_real.png

# 3. Tap Files Tab (324, 1990)
Write-Host "Tapping Files Tab (324, 1990)..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input tap 324 1990
Start-Sleep -Seconds 3
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_files_tab_real.png
& $Adb -s $targetDevice pull /sdcard/screen_files_tab_real.png scripts/screen_files_tab_real.png
Write-Host "Pulled scripts/screen_files_tab_real.png" -ForegroundColor Green

# 4. Tap AI Chat Tab (756, 1990)
Write-Host "Tapping AI Chat Tab (756, 1990)..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input tap 756 1990
Start-Sleep -Seconds 3
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_aichat_tab_real.png
& $Adb -s $targetDevice pull /sdcard/screen_aichat_tab_real.png scripts/screen_aichat_tab_real.png
Write-Host "Pulled scripts/screen_aichat_tab_real.png" -ForegroundColor Green

Write-Host "VERIFICATION SCREENSHOTS PULLED!" -ForegroundColor Cyan
