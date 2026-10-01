$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$PackageName = "com.officedocument.word.docx.xlsx.viewer"
$MainActivity = "com.nextaitechnology.officedocument.feature.main.MainActivity"

& $Adb connect 192.168.1.3:40333
Start-Sleep -Seconds 1

Write-Host "Bringing Office Document to foreground..." -ForegroundColor Yellow
& $Adb -s 192.168.1.3:40333 shell am start -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -n "$PackageName/$MainActivity"
Start-Sleep -Seconds 2

# Tap Tools Tab at bottom (540, 2100)
Write-Host "Tapping Tools Tab..." -ForegroundColor Yellow
& $Adb -s 192.168.1.3:40333 shell input tap 540 2100
Start-Sleep -Seconds 2

# Capture screenshot
& $Adb -s 192.168.1.3:40333 shell screencap -p /sdcard/verify_pdftools.png
& $Adb -s 192.168.1.3:40333 pull /sdcard/verify_pdftools.png scripts/verify_pdftools.png
Write-Host "PDF Tools Screen captured successfully!" -ForegroundColor Green
