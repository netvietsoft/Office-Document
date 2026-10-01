# Pair, Connect, Install and Launch on Chairman Test Device
$Adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$Ip = "192.168.1.18"
$PairPort = "36295"
$ConnectPort = "40159"
$PairCode = "614752"
$PackageName = "com.officedocument.word.docx.xlsx.viewer"
$MainActivity = "com.nextaitechnology.officedocument.feature.main.MainActivity"
$ApkPath = "CONVERT\app-debug.apk"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "NextAI Office Suite - Connect & Deploy to $Ip" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Ensure server is started
& $Adb start-server

# 2. Try connect first
Write-Host "[1/5] Connecting to $Ip`:$ConnectPort..." -ForegroundColor Yellow
$connRes = & $Adb connect "$Ip`:$ConnectPort"
Write-Host $connRes

# If failed to connect, try pairing
if ($connRes -match "failed" -or $connRes -match "unable") {
    Write-Host "[Info] Trying pair to $Ip`:$PairPort with code $PairCode..." -ForegroundColor Yellow
    $pairRes = & $Adb pair "$Ip`:$PairPort" $PairCode
    Write-Host $pairRes
    Start-Sleep -Seconds 1
    $connRes = & $Adb connect "$Ip`:$ConnectPort"
    Write-Host $connRes
}

# 3. Check attached devices
Start-Sleep -Seconds 2
$devOutput = & $Adb devices -l
Write-Host "`nAttached Devices:" -ForegroundColor Green
Write-Host $devOutput

$target = ""
foreach ($line in ($devOutput -split "`r?`n")) {
    if ($line -match "$Ip" -and $line -match "device") {
        $target = ($line -split "\s+")[0]
        break
    }
}

if (-not $target) {
    # Check if any device is connected
    foreach ($line in ($devOutput -split "`r?`n")) {
        if ($line -match "\s+device\s+") {
            $target = ($line -split "\s+")[0]
            break
        }
    }
}

if (-not $target) {
    Write-Host "[ERROR] Could not find connected device!" -ForegroundColor Red
    exit 1
}

Write-Host "`n-> Selected Target: $target" -ForegroundColor Cyan

# 4. Install APK
Write-Host "`n[3/5] Installing APK: $ApkPath onto $target..." -ForegroundColor Yellow
$installRes = & $Adb -s $target install -r -d $ApkPath
Write-Host $installRes

# 5. Grant runtime permissions
Write-Host "`n[4/5] Granting permissions & Setting reverse port 1500..." -ForegroundColor Yellow
& $Adb -s $target shell pm grant $PackageName android.permission.CAMERA 2>$null
& $Adb -s $target shell pm grant $PackageName android.permission.READ_EXTERNAL_STORAGE 2>$null
& $Adb -s $target shell pm grant $PackageName android.permission.WRITE_EXTERNAL_STORAGE 2>$null
& $Adb -s $target shell pm grant $PackageName android.permission.READ_MEDIA_IMAGES 2>$null
& $Adb -s $target shell pm grant $PackageName android.permission.POST_NOTIFICATIONS 2>$null
& $Adb -s $target reverse tcp:1500 tcp:1500
& $Adb -s $target reverse --list

# 6. Launch Application
Write-Host "`n[5/5] Launching Application..." -ForegroundColor Yellow
& $Adb -s $target shell am force-stop $PackageName
Start-Sleep -Milliseconds 500
$launchRes = & $Adb -s $target shell am start -n "$PackageName/$MainActivity"
Write-Host $launchRes

Write-Host "`nCapturing screenshot to scripts/screen_chairman_live.png..." -ForegroundColor Yellow
& $Adb -s $target shell screencap -p /sdcard/screen_temp.png
& $Adb -s $target pull /sdcard/screen_temp.png scripts/screen_chairman_live.png
& $Adb -s $target shell rm -f /sdcard/screen_temp.png
Get-Item scripts/screen_chairman_live.png | Select-Object Name, Length, LastWriteTime

Write-Host "`n[SUCCESS] Deployment and launch completed successfully on $target!" -ForegroundColor Green
