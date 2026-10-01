# Check AAB signature
$aabPath = "F:\APP\Ikame\Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure\File\OfficeDocument_v2.1.15_311217_release.aab"
$keytool = Get-Command keytool -ErrorAction SilentlyContinue
if (-not $keytool) {
    $found = Get-ChildItem "C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe", "C:\Program Files\Java\*\bin\keytool.exe" -ErrorAction SilentlyContinue
    if ($found) {
        $keytool = $found[0].FullName
    }
} else {
    $keytool = $keytool.Source
}

if ($keytool) {
    Write-Host "Using keytool at: $keytool"
    & $keytool -printcert -jarfile $aabPath
} else {
    Write-Host "Keytool not found"
}
