$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
& $Adb connect 192.168.1.3:40333
Start-Sleep -Seconds 1
# Dismiss the ad
& $Adb -s 192.168.1.3:40333 shell input keyevent KEYCODE_BACK
Start-Sleep -Seconds 1
# Tap Tools Tab (540, 2100) or tap (675, 580)
& $Adb -s 192.168.1.3:40333 shell input tap 540 2100
Start-Sleep -Seconds 2
& $Adb -s 192.168.1.3:40333 shell screencap -p /sdcard/verify_pdftools.png
& $Adb -s 192.168.1.3:40333 pull /sdcard/verify_pdftools.png scripts/verify_pdftools.png
Write-Host "DISMISS AD AND CAPTURE PDF TOOLS"
