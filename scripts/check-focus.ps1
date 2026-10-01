$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"

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

$focus = & $Adb -s $targetDevice shell dumpsys window displays
$focusLines = $focus | Select-String -Pattern "mCurrentFocus|mFocusedApp"
$focusLines | Out-String | Write-Host

Write-Host "`nRecent crashes:"
$crashes = & $Adb -s $targetDevice shell logcat -d -t 100 "*:E"
$crashes | Select-String -Pattern "FATAL|AndroidRuntime|officedocument" | Out-String | Write-Host
