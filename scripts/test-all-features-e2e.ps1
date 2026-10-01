$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$Pkg = "com.officedocument.word.docx.xlsx.viewer"
$Apk = "CONVERT/Android/app/build/outputs/apk/debug/app-debug.apk"

Write-Host ">>> Waiting for device online..." -ForegroundColor Cyan
& $Adb wait-for-device

Write-Host ">>> Installing APK..." -ForegroundColor Cyan
& $Adb install -r $Apk

Write-Host ">>> Granting permissions..." -ForegroundColor Cyan
& $Adb shell pm grant $Pkg android.permission.CAMERA 2>$null
& $Adb shell pm grant $Pkg android.permission.POST_NOTIFICATIONS 2>$null

Write-Host ">>> Launching MainActivity..." -ForegroundColor Cyan
& $Adb shell am start -n "$Pkg/com.nextaitechnology.officedocument.feature.main.MainActivity"
Start-Sleep -Seconds 5

Write-Host ">>> Capturing Home Screen..." -ForegroundColor Cyan
& $Adb shell screencap -p /sdcard/e2e_home.png
& $Adb pull /sdcard/e2e_home.png test_screen_home.png

Write-Host ">>> Checking Logcat for app logs..." -ForegroundColor Cyan
& $Adb logcat -d -s "OfficeApp:*" "AnalyticsTracker:*" "CrashlyticsManager:*" "MainActivity:*" "PdfConversionRepo:*" | Select-Object -First 25 | ForEach-Object { Write-Host $_ }

Write-Host ">>> Done!" -ForegroundColor Green
