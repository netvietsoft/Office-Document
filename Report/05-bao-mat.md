# 5. Phân Tích Lỗ Hổng Bảo Mật & Phương Án Khắc Phục Triệt Để

> **Mục đích:** Đánh giá các nguy cơ an ninh, phương thức tấn công tiềm tàng từ bản decompile và phương án khắc phục trong phiên bản tái dựng.

---

## 5.1 Các Lỗ Hổng Nghiêm Trọng & Giải Pháp Khắc Phục

### Lỗ Hổng S1: Upload Toàn Bộ File Tài Liệu Người Dùng Lên Server Thứ Ba
- **Mô tả:** Khi convert HWP, ứng dụng gốc upload toàn bộ file nhạy cảm kèm mật khẩu lên `https://office-convert.begamob.com/convert`.
- **Nguy cơ tấn công:** MITM đánh cắp tài liệu bí mật, rò rỉ dữ liệu người dùng trên cloud không rõ nguồn gốc.
- **Khắc phục trong bản mới:** Tự dựng Backend chuyển đổi riêng trên cổng **6033**, mã hóa truyền tải TLS 1.3, xóa tệp tạm ngay sau khi convert, ưu tiên xử lý cục bộ trên thiết bị.

### Lỗ Hổng S2: HTTP Inspector (Chucker) Bật Sẵn Trong Bản Release
- **Mô tả:** Chucker ghi lại toàn bộ request/response, token và mật khẩu vào database nội bộ của app.
- **Nguy cơ:** Malware hoặc bất kỳ ai cầm máy có thể trích xuất token mua hàng và file tài liệu qua UI Chucker.
- **Khắc phục:** Loại bỏ hoàn toàn Chucker trong release build, chỉ kích hoạt khi `BuildConfig.DEBUG == true`.

### Lỗ Hổng S3: FTP Server Không Mã Hóa (Cleartext), Tài Khoản Anonymous, Port 8982
- **Mô tả:** `FtpService` chạy Apache MINA FTPServer port 8982 cho phép truy cập đọc/ghi toàn bộ bộ nhớ ngoài không cần mật khẩu.
- **Nguy cơ:** Kẻ tấn công trong cùng mạng Wi-Fi công cộng có thể đọc, xóa hoặc chèn file độc hại vào máy người dùng.
- **Khắc phục:** **Loại bỏ hoàn toàn FTP server**; thay bằng `SecureTransferService` chạy WebDAV/HTTPS có mã PIN xác thực 4 chữ số ngẫu nhiên và chỉ mở thư mục được chỉ định.

### Lỗ Hổng S4: Cấu Hình Mạng Cho Phép Cleartext HTTP Traffic
- **Mô tả:** `network_security_config.xml` cho phép cleartext traffic.
- **Khắc phục:** Thiết lập `android:usesCleartextTraffic="false"` trong AndroidManifest và áp dụng Certificate Pinning cho domain Backend.
