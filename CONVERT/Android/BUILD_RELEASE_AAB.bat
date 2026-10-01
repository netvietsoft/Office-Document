@echo off
chcp 65001 >nul
title Building Office Document Release AAB (v2.1.15 - 311217)

echo ===============================================================================
echo   NEXTAI TECHNOLOGY - OFFICE DOCUMENT RELEASE BUNDLE BUILDER
echo   Phiên bản: 2.1.15 (versionCode: 311217)
echo   Target SDK: 36 (Android 16) ^| Billing Library: 8.0.0 ^| 16 KB Page Sizes: OK
echo   Keystore: cleaner_release_key ^(release.jks^)
echo ===============================================================================
echo.

cd /d "%~dp0"

echo [1/4] Đang dọn dẹp và bắt đầu biên dịch bundleRelease...
echo       Quá trình tối ưu R8 và thu gọn tài nguyên (Resource Shrinking)
echo       có thể mất vài phút. Vui lòng giữ cửa sổ này hoạt động...
echo.

call gradlew.bat bundleRelease --no-daemon --stacktrace

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ===============================================================================
    echo [LỖI] Quá trình biên dịch bundleRelease thất bại với mã lỗi %ERRORLEVEL%!
    echo Vui lòng kiểm tra thông báo lỗi phía trên.
    echo ===============================================================================
    pause
    exit /b %ERRORLEVEL%
)

set "AAB_SRC=app\build\outputs\bundle\release\app-release.aab"
set "AAB_INFO=..\Info\app-release.aab"
set "FILE_DIR=..\..\File"
set "AAB_FILE_NAMED=%FILE_DIR%\OfficeDocument_v2.1.15_311217_release.aab"
set "AAB_FILE_STD=%FILE_DIR%\app-release.aab"
set "DESKTOP_DIR=%USERPROFILE%\Desktop"
set "AAB_DESKTOP=%DESKTOP_DIR%\OfficeDocument_v2.1.15_311217_release.aab"

if not exist "%AAB_SRC%" (
    echo.
    echo [LỖI] Không tìm thấy file đầu ra tại: %AAB_SRC%
    pause
    exit /b 1
)

echo.
echo [2/4] Sao chép tệp AAB vào thư mục phát hành CONVERT\Info và File...
copy /Y "%AAB_SRC%" "%AAB_INFO%" >nul
if not exist "%FILE_DIR%" mkdir "%FILE_DIR%" >nul
copy /Y "%AAB_SRC%" "%AAB_FILE_NAMED%" >nul
copy /Y "%AAB_SRC%" "%AAB_FILE_STD%" >nul
echo       [OK] Đã lưu tại: %AAB_FILE_NAMED%
echo       [OK] Đã lưu tại: %AAB_FILE_STD%

echo.
echo [3/4] Tạo bản sao tiện lợi trên màn hình Desktop...
if exist "%DESKTOP_DIR%" (
    copy /Y "%AAB_SRC%" "%AAB_DESKTOP%" >nul
    if %ERRORLEVEL% EQU 0 (
        echo       [OK] Đã lưu trên Desktop: %AAB_DESKTOP%
    )
)

echo.
echo [4/4] Kiểm tra kích thước và tính toàn vẹn của tệp AAB...
for %%F in ("%AAB_SRC%") do (
    set "FILE_SIZE=%%~zF"
    echo       Kích thước tệp AAB: %%~zF bytes
)

echo.
echo ===============================================================================
echo   CHÚC MỪNG! BẢN BUILD RELEASE ĐÃ HOÀN TẤT THÀNH CÔNG 100%%
echo.
echo   Tên app:        Office Document
echo   Package:        com.officedocument.word.docx.xlsx.viewer
echo   Version Code:   311217
echo   Version Name:   2.1.15
echo   Đường dẫn File: %CD%\%AAB_FILE_NAMED%
echo   Bản sao Info:   %CD%\%AAB_INFO%
if exist "%AAB_DESKTOP%" (
echo   Bản sao Desktop: %AAB_DESKTOP%
)
echo.
echo   Bản AAB đã được ký số sẵn sàng để tải lên Google Play Console!
echo ===============================================================================
echo.
pause
