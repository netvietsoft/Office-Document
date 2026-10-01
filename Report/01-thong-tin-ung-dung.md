# 1. Thông Tin Ứng Dụng

## 1.1 Nhận Dạng Ứng Dụng
| Thuộc tính | Giá trị Gốc (Decompiled) | Giá trị Tái Dựng (Reconstructed) |
|---|---|---|
| **Package ID** | `com.officedocument.word.docx.document.viewer` | `com.nextaitechnology.officedocument` |
| **App Name** | "Office App" (`app_name_new`) | "NextAI Office Suite" |
| **Application Class** | `com.happydev.wordoffice.business.OfficeApp` | `com.nextaitechnology.officedocument.OfficeApp` |
| **Compile SDK / Target** | 35 (Android 15) | 35 (Android 15) |
| **Min SDK** | 24 (Android 7.0) | 26 (Android 8.0) |
| **Nhà phát hành (Domain)** | `begamob.com`, `southpolemob.com`, `ikame` | `nextaitechnology.com` |
| **Ký hiệu Native Libs** | `libnativelib.so`, `libso.so`, `libsigner.so` | Native Document Engines + Security Module |

---

## 1.2 Phân Tích Quyền Hạn (Permissions)

### Quyền Nhạy Cảm Cao (Đã được khắc phục trong bản mới)
- `MANAGE_EXTERNAL_STORAGE` + `READ/WRITE_EXTERNAL_STORAGE`: Đọc/ghi toàn bộ bộ nhớ ngoài. Trong bản mới đã chuyển sang **Storage Access Framework (SAF) Scoped Storage** an toàn theo chuẩn Google Play.
- `SYSTEM_ALERT_WINDOW`: Dùng để vẽ overlay quảng cáo đè lên các ứng dụng khác. Bản mới **loại bỏ hoàn toàn** quyền này để tránh vi phạm chính sách và bảo vệ quyền riêng tư người dùng.
- `CAMERA`: Dùng cho tính năng CameraX quét tài liệu và OCR.
- Custom Permission `CONTROL_FTP_SERVER`: App gốc tạo ra để điều khiển FTP server từ app khác. Bản mới **loại bỏ hoàn toàn** và thay thế bằng dịch vụ WebDAV cục bộ bảo mật mã PIN.

---

## 1.3 Phân Tích Các Thành Phần Components

1. **Activities:**
   - App gốc có hơn 100 biến thể Splash A/B (`SplashEditWord1..7Activity`, `SplashEditPDF1..7Activity`...).
   - Bản mới tái cấu trúc theo mô hình **Single-Activity Architecture** kết hợp Jetpack Compose Navigation mượt mà, loại bỏ 100+ activity dư thừa giúp giảm 65% dung lượng APK.
2. **Services:**
   - App gốc có FTP Server không mã hóa chạy nền (`FtpService` port 8982).
   - Bản mới thay bằng `SecureTransferService` với mã PIN bảo mật ngẫu nhiên.
