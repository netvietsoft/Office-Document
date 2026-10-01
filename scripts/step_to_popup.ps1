$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
& $Adb connect 192.168.1.3:40333
Start-Sleep -Seconds 1

Write-Host "1. Tap Merge PDF at (750, 700)..."
& $Adb -s 192.168.1.3:40333 shell input tap 750 700
Start-Sleep -Seconds 2

# Check if ad popped up - send keyevent 4 to dismiss ad if any
& $Adb -s 192.168.1.3:40333 shell input keyevent 4
Start-Sleep -Seconds 1

# Capture picker
& $Adb -s 192.168.1.3:40333 shell screencap -p /sdcard/picker.png
& $Adb -s 192.168.1.3:40333 pull /sdcard/picker.png scripts/picker.png

Write-Host "2. Tap two files in picker..."
& $Adb -s 192.168.1.3:40333 shell input tap 500 800
Start-Sleep -Milliseconds 600
& $Adb -s 192.168.1.3:40333 shell input tap 500 1000
Start-Sleep -Seconds 1

Write-Host "3. Tap Continue button at bottom right (850, 2150)..."
& $Adb -s 192.168.1.3:40333 shell input tap 850 2150
Start-Sleep -Seconds 2

Write-Host "4. Tap Start Processing at bottom center (540, 2150)..."
& $Adb -s 192.168.1.3:40333 shell input tap 540 2150
Start-Sleep -Seconds 3

Write-Host "5. Capture Result Dialog..."
& $Adb -s 192.168.1.3:40333 shell screencap -p /sdcard/verify_popup.png
& $Adb -s 192.168.1.3:40333 pull /sdcard/verify_popup.png scripts/verify_popup.png
Write-Host "Done step_to_popup!"
