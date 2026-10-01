$Adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$Device = "192.168.1.18:40159"
$Pkg = "com.officedocument.word.docx.xlsx.viewer"

& $Adb connect $Device
Start-Sleep -Milliseconds 400
$pidVal = (& $Adb -s $Device shell pidof $Pkg).Trim()
Write-Host "App PID: $pidVal"
if ($pidVal) {
    & $Adb -s $Device logcat -d --pid=$pidVal -t 150
} else {
    Write-Host "App not running!"
}
