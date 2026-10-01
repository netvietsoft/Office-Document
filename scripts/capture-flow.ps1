$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
& $Adb connect 192.168.1.3:40333
Start-Sleep -Seconds 1

Write-Host "Press BACK key to dismiss ad..."
& $Adb -s 192.168.1.3:40333 shell input keyevent 4
Start-Sleep -Seconds 2

& $Adb -s 192.168.1.3:40333 shell screencap -p /sdcard/now.png
& $Adb -s 192.168.1.3:40333 pull /sdcard/now.png scripts/now.png
Write-Host "Done"
