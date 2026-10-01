# Check AAB version metadata
$aabPath = "F:\APP\Ikame\Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure\File\OfficeDocument_v2.1.15_311217_release.aab"
$aapt2 = Get-ChildItem "C:\Users\PC.DESKTOP-81LIH38\AppData\Local\Android\Sdk\build-tools\*\aapt2.exe" | Select-Object -Last 1
if ($aapt2) {
    Write-Host "Using aapt2 at: $($aapt2.FullName)"
    & $aapt2.FullName dump badging $aabPath
}
