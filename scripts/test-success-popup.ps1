$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
& $Adb connect 192.168.1.3:40333
Start-Sleep -Seconds 1

Write-Host "1. Tap Merge PDF at (750, 680)..."
& $Adb -s 192.168.1.3:40333 shell input tap 750 680
Start-Sleep -Seconds 2

Write-Host "2. Capture Picker and Select 2 files..."
& $Adb -s 192.168.1.3:40333 shell screencap -p /sdcard/picker.png
& $Adb -s 192.168.1.3:40333 pull /sdcard/picker.png scripts/picker.png

# In file picker, tap items
& $Adb -s 192.168.1.3:40333 shell input tap 500 800
Start-Sleep -Milliseconds 600
& $Adb -s 192.168.1.3:40333 shell input tap 500 1000
Start-Sleep -Seconds 1

Write-Host "3. Tap Continue button at bottom right (850, 2150)..."
& $Adb -s 192.168.1.3:40333 shell input tap 850 2150
Start-Sleep -Seconds 2

Write-Host "4. Tap Start Processing button at bottom (540, 2150)..."
& $Adb -s 192.168.1.3:40333 shell input tap 540 2150
Start-Sleep -Seconds 4

Write-Host "5. Capture Success Result Dialog..."
& $Adb -s 192.168.1.3:40333 shell screencap -p /sdcard/verify_success_popup.png
& $Adb -s 192.168.1.3:40333 pull /sdcard/verify_success_popup.png scripts/verify_success_popup.png
Write-Host "SUCCESS POPUP TEST COMPLETED"
