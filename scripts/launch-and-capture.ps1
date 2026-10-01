$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$PackageName = "com.officedocument.word.docx.xlsx.viewer"

& $Adb start-server

$targetDevice = ""
for ($i = 0; $i -lt 10; $i++) {
    Start-Sleep -Seconds 1
    $devLines = & $Adb devices -l
    foreach ($line in $devLines) {
        if ($line -match "device\s+" -or $line -match "device$") {
            $targetDevice = ($line -split "\s+")[0]
            break
        }
    }
    if ($targetDevice -ne "") { break }
}

Write-Host "Device: $targetDevice"

# Launch app using monkey to guarantee bringing to front
Write-Host "Launching app with monkey..."
& $Adb -s $targetDevice shell monkey -p $PackageName -c android.intent.category.LAUNCHER 1
Start-Sleep -Seconds 3

# Check current focus
$focus = & $Adb -s $targetDevice shell dumpsys window displays | Select-String -Pattern "mCurrentFocus|mFocusedApp"
Write-Host "Focus now:"
$focus | Out-String | Write-Host

# Capture screen
& $Adb -s $targetDevice shell screencap -p /sdcard/screen_monkey_launch.png
& $Adb -s $targetDevice pull /sdcard/screen_monkey_launch.png scripts/screen_monkey_launch.png
Write-Host "Pulled scripts/screen_monkey_launch.png"
