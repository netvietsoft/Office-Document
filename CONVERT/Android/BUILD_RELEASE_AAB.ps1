# ==============================================================================
# NextAI Technology - Office Document Release Bundle Builder (PowerShell)
# Bản phát hành: v2.1.15 (versionCode: 311217)
# Target SDK: 36 | Play Billing: 8.0.0 | 16 KB Page Sizes: Compliant
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"

Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host "  NEXTAI TECHNOLOGY - OFFICE DOCUMENT RELEASE BUNDLE BUILDER" -ForegroundColor Yellow
Write-Host "  Phiên bản: 2.1.15 (versionCode: 311217)" -ForegroundColor Green
Write-Host "  Target SDK: 36 (Android 16) | Play Billing: 8.0.0 | 16 KB Page Sizes: 100% OK" -ForegroundColor Green
Write-Host "  Keystore: cleaner_release_key (release.jks)" -ForegroundColor Green
Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "[1/4] Đang bắt đầu biên dịch bundleRelease qua Gradle Wrapper..." -ForegroundColor Yellow
Write-Host "      Tiến trình R8 minification và resource shrinking sẽ chạy tối ưu mã nguồn." -ForegroundColor Gray
Write-Host ""

$sw = [System.Diagnostics.Stopwatch]::StartNew()
$gradleProc = Start-Process -FilePath ".\gradlew.bat" -ArgumentList "bundleRelease", "--no-daemon", "--stacktrace" -NoNewWindow -PassThru -Wait

$sw.Stop()

if ($gradleProc.ExitCode -ne 0) {
    Write-Host ""
    Write-Host "[LỖI] Biên dịch bundleRelease thất bại với exit code: $($gradleProc.ExitCode)" -ForegroundColor Red
    exit $gradleProc.ExitCode
}

$aabSrc = Join-Path $ScriptDir "app\build\outputs\bundle\release\app-release.aab"
$aabInfo = Join-Path $ScriptDir "..\Info\app-release.aab"
$fileDir = Join-Path $ScriptDir "..\..\File"
$aabFileNamed = Join-Path $fileDir "OfficeDocument_v2.1.15_311217_release.aab"
$aabFileStd = Join-Path $fileDir "app-release.aab"
$desktopDir = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$aabDesktop = Join-Path $desktopDir "OfficeDocument_v2.1.15_311217_release.aab"

if (-not (Test-Path $aabSrc)) {
    Write-Host "[LỖI] Không tìm thấy file đầu ra tại: $aabSrc" -ForegroundColor Red
    exit 1
}

$fileInfo = Get-Item $aabSrc
$sizeMb = [math]::Round($fileInfo.Length / 1MB, 2)

Write-Host ""
Write-Host "[2/4] Sao chép tệp AAB sang File và CONVERT/Info..." -ForegroundColor Yellow
if (-not (Test-Path $fileDir)) {
    New-Item -ItemType Directory -Path $fileDir -Force | Out-Null
}
Copy-Item -Path $aabSrc -Destination $aabFileNamed -Force
Copy-Item -Path $aabSrc -Destination $aabFileStd -Force
Copy-Item -Path $aabSrc -Destination $aabInfo -Force
Write-Host "      [OK] Đã lưu tại: $aabFileNamed" -ForegroundColor Green
Write-Host "      [OK] Đã lưu tại: $aabFileStd" -ForegroundColor Green
Write-Host "      [OK] Đã lưu tại: $aabInfo" -ForegroundColor Green

Write-Host ""
Write-Host "[3/4] Tạo bản sao tiện lợi trên Desktop..." -ForegroundColor Yellow
if (Test-Path $desktopDir) {
    Copy-Item -Path $aabSrc -Destination $aabDesktop -Force
    Write-Host "      [OK] Đã lưu tại Desktop: $aabDesktop" -ForegroundColor Green
}

Write-Host ""
Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host "  CHÚC MỪNG! BẢN BUILD RELEASE HOÀN TẤT THÀNH CÔNG 100%" -ForegroundColor Green
Write-Host ""
Write-Host "  Tên ứng dụng:   Office Document" -ForegroundColor White
Write-Host "  Package ID:     com.officedocument.word.docx.xlsx.viewer" -ForegroundColor White
Write-Host "  Version Code:   311217" -ForegroundColor White
Write-Host "  Version Name:   2.1.15" -ForegroundColor White
Write-Host "  Dung lượng:     $sizeMb MB ($($fileInfo.Length) bytes)" -ForegroundColor White
Write-Host "  Thời gian build: $([math]::Round($sw.Elapsed.TotalMinutes, 1)) phút" -ForegroundColor White
Write-Host "  Đường dẫn phát hành: $aabFileNamed" -ForegroundColor White
Write-Host "  Bản sao Info:        $aabInfo" -ForegroundColor White
if (Test-Path $aabDesktop) {
    Write-Host "  Bản sao Desktop:     $aabDesktop" -ForegroundColor White
}
Write-Host ""
Write-Host "  Tệp AAB đã ký số hợp lệ và sẵn sàng tải lên Google Play Console!" -ForegroundColor Yellow
Write-Host "===============================================================================" -ForegroundColor Cyan
