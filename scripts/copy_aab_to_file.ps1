# Script to copy release AAB to target directories and verify 16KB compliance
$src = "F:\APP\Ikame\Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure\CONVERT\Android\app\build\outputs\bundle\release\app-release.aab"
$targetDir = "F:\APP\Ikame\Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure\File"
$targetNamed = Join-Path $targetDir "OfficeDocument_v2.1.15_311217_release.aab"
$targetStandard = Join-Path $targetDir "app-release.aab"
$infoPath = "F:\APP\Ikame\Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure\CONVERT\Info\app-release.aab"
$desktop = [System.Environment]::GetFolderPath("Desktop")
$desktopNamed = Join-Path $desktop "OfficeDocument_v2.1.15_311217_release.aab"

if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

Copy-Item -Path $src -Destination $targetNamed -Force
Copy-Item -Path $src -Destination $targetStandard -Force
Copy-Item -Path $src -Destination $infoPath -Force
if (Test-Path $desktop) {
    Copy-Item -Path $src -Destination $desktopNamed -Force
}

$item = Get-Item $targetNamed
Write-Host "File copied successfully:"
Write-Host "Path: $($item.FullName)"
Write-Host "Size: $([math]::Round($item.Length / 1MB, 2)) MB ($($item.Length) bytes)"
$hash = Get-FileHash -Path $item.FullName -Algorithm SHA256
Write-Host "SHA256: $($hash.Hash)"

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($src)
$soFiles = @($zip.Entries | Where-Object { $_.FullName -like "*.so" })
Write-Host "Native .so count: $($soFiles.Count)"
if ($soFiles.Count -gt 0) {
    $soFiles | ForEach-Object { Write-Host " - $($_.FullName)" }
} else {
    Write-Host "100% 16 KB compliant (0 native .so files inside AAB)"
}
$zip.Dispose()
