$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
& $Adb connect 192.168.1.3:40333
Start-Sleep -Seconds 1
# Tap Scanner OCR at (400, 580)
& $Adb -s 192.168.1.3:40333 shell input tap 400 580
Start-Sleep -Seconds 3
& $Adb -s 192.168.1.3:40333 shell screencap -p /sdcard/verify_scanner.png
& $Adb -s 192.168.1.3:40333 pull /sdcard/verify_scanner.png scripts/verify_scanner.png
Write-Host "TAP SCANNER COMPLETED"
