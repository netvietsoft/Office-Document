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
    Write-Host "Device not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Connected Device: $targetDevice" -ForegroundColor Green

# 1. Tap Tab Công Cụ (X=540, Y=2100)
Write-Host "Tapping Tab Công Cụ..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input tap 540 2100
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_tools.png
& $Adb -s $targetDevice pull /sdcard/screen_tools.png live_test_tools_screen.png

# 2. Tap Tab Cài Đặt (X=972, Y=2100)
Write-Host "Tapping Tab Cài Đặt..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input tap 972 2100
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_settings.png
& $Adb -s $targetDevice pull /sdcard/screen_settings.png live_test_settings_screen.png

# 3. Tap back to Tab Trang Chủ (X=108, Y=2100)
Write-Host "Tapping back to Tab Trang Chủ..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input tap 108 2100
Start-Sleep -Seconds 1

Write-Host "All screen captures completed successfully!" -ForegroundColor Green
