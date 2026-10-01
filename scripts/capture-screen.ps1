$Adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$Device = "192.168.1.18:40159"
$LocalPath = "scripts\screen_chairman_real.png"

& $Adb connect $Device
Start-Sleep -Milliseconds 600
& $Adb -s $Device shell screencap -p /sdcard/screen.png
Start-Sleep -Milliseconds 300
& $Adb -s $Device pull /sdcard/screen.png $LocalPath
Get-Item $LocalPath | Select-Object Name, Length, LastWriteTime
