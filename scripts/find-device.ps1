$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"

& $Adb start-server

for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Seconds 1
    $devLines = & $Adb devices -l
    Write-Host "Attempt $($i+1):"
    $devLines | Out-String | Write-Host
    foreach ($line in $devLines) {
        if ($line -match "device\s+" -or $line -match "device$") {
            Write-Host "CONNECTED TO: $line" -ForegroundColor Green
            exit 0
        }
    }
}
Write-Host "Not connected after 15s" -ForegroundColor Red
