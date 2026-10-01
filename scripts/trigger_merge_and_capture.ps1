$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
& $Adb connect 192.168.1.3:40333
Start-Sleep -Seconds 1

Write-Host "1. Tap File 1 at (500, 400)..."
& $Adb -s 192.168.1.3:40333 shell input tap 500 400
Start-Sleep -Milliseconds 600

Write-Host "2. Tap File 2 at (500, 500)..."
& $Adb -s 192.168.1.3:40333 shell input tap 500 500
Start-Sleep -Seconds 1

Write-Host "3. Tap Continue at (800, 2100)..."
& $Adb -s 192.168.1.3:40333 shell input tap 800 2100
Start-Sleep -Seconds 2

Write-Host "4. Tap Start Processing at (540, 2100)..."
& $Adb -s 192.168.1.3:40333 shell input tap 540 2100
Start-Sleep -Seconds 4

Write-Host "5. Capture Success Popup..."
& $Adb -s 192.168.1.3:40333 shell screencap -p /sdcard/popup_success_verified.png
& $Adb -s 192.168.1.3:40333 pull /sdcard/popup_success_verified.png scripts/popup_success_verified.png
Write-Host "Done trigger_merge_and_capture!"
