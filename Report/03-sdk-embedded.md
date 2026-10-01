# 3. Danh Sách SDK Được Nhúng & Kế Hoạch Hiện Đại Hóa

> **Mục đích:** Thống kê ~40+ thư viện và SDK bên thứ ba từ file decompile, phân tích chức năng, vị trí và đề xuất phương án thay thế sạch.

---

## 3.1 Bảng Phân Loại SDK

| Nhóm SDK | SDK Gốc (Decompiled) | Vai Trò & Chức Năng | Đánh Giá & Vị Trí Thay Thế Mới |
|---|---|---|---|
| **Document Engine** | **Artifex SmartOffice** (`libso.so` 16.5MB) | Engine lõi đọc/sửa Word/Excel/PPT/HWP/PDF | Giữ nguyên hoặc tích hợp qua native abstraction `core/engine/` |
| **PDF Rendering** | **MuPDF** (`libmupdf_java.so`) + **PDFBox** | Render trang PDF vector và trích xuất text | Sử dụng MuPDF + Apache PDFBox Android |
| **Scanner & OCR** | **SmartCropper** + **TensorFlow Lite** | Nhận diện mép tài liệu và trích chữ | Nâng cấp sang **Google ML Kit Document Scanner** hiện đại |
| **Mạng Quảng Cáo** | **AppLovin MAX** + 10 Ad Networks | Quản lý quảng cáo đa tầng | Tạo abstraction interface `core/ads/AdManager` độc lập |
| **IAP Billing** | **Google Play Billing Client** | Thanh toán đơn hàng in-app | Nâng cấp lên **Google Play Billing 7.0.0** |
| **Network & DI** | Retrofit, OkHttp, Chucker, Hilt | Gọi mạng và Dependency Injection | Giữ Retrofit + Hilt, **gỡ bỏ hoàn toàn Chucker trong release** |
| **Telemetry & APM** | **Alibaba APM Insight** (`libapminsight.so`) | Giám sát hiệu năng và telemetry | **Gỡ bỏ hoàn toàn** để bảo vệ quyền riêng tư người dùng |
