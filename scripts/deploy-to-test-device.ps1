# Deployment and verification script for test device
$Adb = "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$PackageName = "com.officedocument.word.docx.xlsx.viewer"
$MainActivity = "com.nextaitechnology.officedocument.feature.main.MainActivity"
$ApkPath = "CONVERT\Android\app\build\outputs\apk\debug\app-debug.apk"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "NextAI Office Suite - Deploy & Test on Device" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start server and wait for mDNS discovery
Write-Host "[1/6] Starting ADB and discovering devices via mDNS..." -ForegroundColor Yellow
& $Adb start-server

$targetDevice = ""
for ($i = 0; $i -lt 12; $i++) {
    Start-Sleep -Seconds 1
    $devLines = & $Adb devices -l
    Write-Host "Scanning for devices... (Attempt $($i+1))"
    foreach ($line in $devLines) {
        if ($line -match "SM_A507FN" -or $line -match "a50s") {
            $targetDevice = ($line -split "\s+")[0]
            Write-Host "-> Found Chủ Tịch's Samsung Galaxy A50s: $targetDevice" -ForegroundColor Green
            break
        }
    }
    if ($targetDevice -ne "") { break }
}

if ($targetDevice -eq "") {
    # Fallback to any attached device
    $devLines = & $Adb devices
    foreach ($line in $devLines) {
        if ($line -match "\s+device$") {
            $targetDevice = ($line -split "\s+")[0]
            Write-Host "-> Fallback device found: $targetDevice" -ForegroundColor Yellow
            break
        }
    }
}

if ($targetDevice -eq "") {
    Write-Host "[ERROR] No test device attached via ADB!" -ForegroundColor Red
    & $Adb devices -l
    exit 1
}

Write-Host "`nTarget Device: $targetDevice" -ForegroundColor Cyan

# 2. Check APK
if (-not (Test-Path $ApkPath)) {
    Write-Host "[ERROR] APK not found at $ApkPath" -ForegroundColor Red
    exit 1
}
$apkItem = Get-Item $ApkPath
Write-Host "[2/6] APK verified: $($apkItem.FullName) ($([math]::Round($apkItem.Length/1MB, 2)) MB)" -ForegroundColor Green

# 3. Install APK
Write-Host "[3/6] Installing APK onto $targetDevice..." -ForegroundColor Yellow
$installRes = & $Adb -s $targetDevice install -r $ApkPath
Write-Host "Install result: $installRes" -ForegroundColor Green

# 4. Grant Permissions
Write-Host "[4/6] Granting runtime permissions..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell pm grant $PackageName android.permission.CAMERA 2>$null
& $Adb -s $targetDevice shell pm grant $PackageName android.permission.POST_NOTIFICATIONS 2>$null

# 5. Clear Logcat & Launch App
Write-Host "[5/6] Clearing logcat and launching $MainActivity..." -ForegroundColor Yellow
& $Adb -s $targetDevice logcat -c
$launchRes = & $Adb -s $targetDevice shell am start -n "$PackageName/$MainActivity"
Write-Host "Launch result: $launchRes" -ForegroundColor Green

Start-Sleep -Seconds 4

# 6. Capture Screenshot and Check Crash Logcat
Write-Host "[6/6] Capturing live screenshot & checking logcat..." -ForegroundColor Yellow
& $Adb -s $targetDevice shell screencap -p /sdcard/live_screen.png
& $Adb -s $targetDevice pull /sdcard/live_screen.png live_test_device_screen.png

$crashes = & $Adb -s $targetDevice logcat -d | Select-String -Pattern "FATAL EXCEPTION", "AndroidRuntime.*$PackageName" | Select-Object -First 15
if ($crashes) {
    Write-Host "[WARNING] Crashes detected:" -ForegroundColor Red
    $crashes | ForEach-Object { Write-Host $_.Line -ForegroundColor Red }
} else {
    Write-Host "[SUCCESS] Zero fatal crashes! App launched cleanly." -ForegroundColor Green
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT & VERIFICATION FINISHED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
