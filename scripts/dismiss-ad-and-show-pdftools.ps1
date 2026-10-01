$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
& $Adb connect 192.168.1.3:40333
Start-Sleep -Seconds 1

# Close ad overlay
& $Adb -s 192.168.1.3:40333 shell input tap 930 250
Start-Sleep -Milliseconds 600
& $Adb -s 192.168.1.3:40333 shell input tap 820 60
Start-Sleep -Milliseconds 600

# Tap Tools Tab at bottom
& $Adb -s 192.168.1.3:40333 shell input tap 540 2100
Start-Sleep -Seconds 2

& $Adb -s 192.168.1.3:40333 shell screencap -p /sdcard/verify_pdftools.png
& $Adb -s 192.168.1.3:40333 pull /sdcard/verify_pdftools.png scripts/verify_pdftools.png
Write-Host "DISMISS AD DONE"
