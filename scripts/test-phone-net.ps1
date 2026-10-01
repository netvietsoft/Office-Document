$Adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$Device = "192.168.1.18:40159"

& $Adb connect $Device
Start-Sleep -Milliseconds 400
Write-Host "1. Testing ping to 192.168.1.222 from phone:"
& $Adb -s $Device shell ping -c 2 192.168.1.222

Write-Host "`n2. Testing curl/http to 192.168.1.222:1500 from phone:"
& $Adb -s $Device shell "curl -s -m 5 http://192.168.1.222:1500/admin/api/stats || echo 'Curl failed'"

Write-Host "`n3. Setup adb reverse tcp:1500 tcp:1500:"
& $Adb -s $Device reverse tcp:1500 tcp:1500
& $Adb -s $Device reverse --list

Write-Host "`n4. Testing curl http://127.0.0.1:1500 from phone via reverse:"
& $Adb -s $Device shell "curl -s -m 5 http://127.0.0.1:1500/admin/api/stats || echo 'Reverse curl failed'"
