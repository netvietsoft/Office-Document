$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
& $Adb connect 192.168.1.3:40333
Start-Sleep -Seconds 1

Write-Host "Closing background apps..."
& $Adb -s 192.168.1.3:40333 shell am force-stop com.sec.android.gallery3d
& $Adb -s 192.168.1.3:40333 shell am force-stop com.mt.mtxx.mtxx.convert
Start-Sleep -Seconds 1

Write-Host "Starting Office Document..."
& $Adb -s 192.168.1.3:40333 shell am start -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -n "com.officedocument.word.docx.xlsx.viewer/com.nextaitechnology.officedocument.feature.main.MainActivity"
Start-Sleep -Seconds 3

# Tap Tools tab (540, 2100)
Write-Host "Tapping Tools tab..."
& $Adb -s 192.168.1.3:40333 shell input tap 540 2100
Start-Sleep -Seconds 2

& $Adb -s 192.168.1.3:40333 shell screencap -p /sdcard/verify_pdftools.png
& $Adb -s 192.168.1.3:40333 pull /sdcard/verify_pdftools.png scripts/verify_pdftools.png
Write-Host "DONE FOCUS OFFICE"
