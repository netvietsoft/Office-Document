$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"

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
Write-Host "Using device: $targetDevice" -ForegroundColor Green

# 1. Press Back to return to MainScreen
Write-Host "1. Pressing Back key..."
& $Adb -s $targetDevice shell input keyevent 4
Start-Sleep -Seconds 2

# 2. Tap Tab 2 (Files Tab: X=324, Y=2170)
Write-Host "2. Tapping Files Tab (324, 2170)..."
& $Adb -s $targetDevice shell input tap 324 2170
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_files_tab.png
& $Adb -s $targetDevice pull /sdcard/screen_files_tab.png scripts/screen_files_tab.png
Write-Host "Pulled scripts/screen_files_tab.png" -ForegroundColor Green

# 3. Tap Tab 3 (Tools Tab: X=540, Y=2170)
Write-Host "3. Tapping Tools Tab (540, 2170)..."
& $Adb -s $targetDevice shell input tap 540 2170
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_tools_tab.png
& $Adb -s $targetDevice pull /sdcard/screen_tools_tab.png scripts/screen_tools_tab.png
Write-Host "Pulled scripts/screen_tools_tab.png" -ForegroundColor Green

# 4. Tap Tab 4 (AI Chat Tab: X=756, Y=2170)
Write-Host "4. Tapping AI Chat Tab (756, 2170)..."
& $Adb -s $targetDevice shell input tap 756 2170
Start-Sleep -Seconds 2
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_aichat_tab.png
& $Adb -s $targetDevice pull /sdcard/screen_aichat_tab.png scripts/screen_aichat_tab.png
Write-Host "Pulled scripts/screen_aichat_tab.png" -ForegroundColor Green

Write-Host "ALL TABS CAPTURED SUCCESSFULLY!" -ForegroundColor Cyan
