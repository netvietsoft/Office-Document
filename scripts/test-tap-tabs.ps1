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

# 1. Bring app to front and dismiss any overlay
Write-Host "Bringing app to front..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input keyevent 4 # back to dismiss any dialog
Start-Sleep -Milliseconds 500
& $Adb -s $targetDevice shell input keyevent 4 # back again just in case
Start-Sleep -Milliseconds 500
& $Adb -s $targetDevice shell am start -n "$PackageName/$MainActivity"
Start-Sleep -Seconds 2

# 2. Tap Tab 2 (Files: X=324, Y=1990)
Write-Host "Tapping Files Tab (324, 1990)..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input tap 324 1990
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_files_en_actual.png
& $Adb -s $targetDevice pull /sdcard/screen_files_en_actual.png scripts/screen_files_en_actual.png
Write-Host "Pulled scripts/screen_files_en_actual.png" -ForegroundColor Green

# 3. Tap Tab 4 (AI Chat: X=756, Y=1990)
Write-Host "Tapping AI Chat Tab (756, 1990)..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input tap 756 1990
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_aichat_en_actual.png
& $Adb -s $targetDevice pull /sdcard/screen_aichat_en_actual.png scripts/screen_aichat_en_actual.png
Write-Host "Pulled scripts/screen_aichat_en_actual.png" -ForegroundColor Green

# 4. Tap Tab 5 (Settings: X=972, Y=1990)
Write-Host "Tapping Settings Tab (972, 1990)..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input tap 972 1990
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_settings_en_actual.png
& $Adb -s $targetDevice pull /sdcard/screen_settings_en_actual.png scripts/screen_settings_en_actual.png
Write-Host "Pulled scripts/screen_settings_en_actual.png" -ForegroundColor Green
