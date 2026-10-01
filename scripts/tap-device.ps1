param(
    [int]$X = 324,
    [int]$Y = 2170,
    [string]$OutputFile = "scripts/screen_files_actual.png"
)

$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"

& $Adb start-server

$targetDevice = ""
for ($i = 0; $i -lt 10; $i++) {
    Start-Sleep -Seconds 1
    $devLines = & $Adb devices -l
    foreach ($line in $devLines) {
        if ($line -match "SM_A507FN" -or $line -match "a50s" -or $line -match "adb-") {
            $targetDevice = ($line -split "\s+")[0]
            break
        }
    }
    if ($targetDevice -ne "") { break }
}

if ($targetDevice -eq "") {
    Write-Host "Device not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Target Device: $targetDevice" -ForegroundColor Green
Write-Host "Tapping ($X, $Y)..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell input tap $X $Y
Start-Sleep -Seconds 2

$sdPath = "/sdcard/$(Split-Path $OutputFile -Leaf)"
& $Adb -s $targetDevice shell screencap -p $sdPath
& $Adb -s $targetDevice pull $sdPath $OutputFile
Write-Host "Saved screenshot to $OutputFile" -ForegroundColor Green
