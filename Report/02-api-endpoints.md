# 2. Danh Sách API Endpoints & Khả Năng Tái Sử Dụng

> **Mục đích:** Thống kê chi tiết các endpoint API trích xuất từ bản decompile, đánh giá chức năng, nhiệm vụ, mô hình dữ liệu và khả năng tái sử dụng.

---

## 2.1 Bảng Chi Tiết Các Đầu API Của Nhà Phát Hành (Publisher Endpoints)

| STT | Endpoint | Phương Thức | Chức Năng / Nhiệm Vụ | Payload Đầu Vào | Dữ Liệu Phản Hồi | Dùng Sẵn Được Không? | Giải Pháp Thay Thế Mới |
|:---:|---|:---:|---|---|---|:---:|---|
| **1** | `https://office-convert.begamob.com/convert` | `POST` | Tải lên file tài liệu (HWP/Word) và chuyển đổi định dạng phía server | Multipart (`file`, `outputFormat`, `password`) | `ConversionResponse` (`downloadUrl`, `jobId`) | ⚠️ Không nên dùng (Lộ dữ liệu user cho server lạ) | Đã dựng lại API tại `POST /api/v1/convert` trên Backend riêng (Port **6033**). |
| **2** | `https://s2s.begamob.com/api/v1/android-event` | `POST` | Xác thực đơn hàng Google Play IAP và báo cáo attribution | JSON `PurchaseData` (`orderId`, `purchaseToken`, `productId`, `adId`) | JSON (`success`, `isVip`, `expiresDate`) | ⚠️ Không dùng được (Cần auth server riêng) | Đã dựng lại API tại `POST /api/v1/android-event` trên Backend riêng (Port **6033**). |
| **3** | `https://office-delete-account.begamob.com/` | `GET` | Trang web tiếp nhận yêu cầu xóa tài khoản người dùng | Web URL (Query params) | HTML Webpage | ❌ Bị lỗi (URL gốc dán nhầm `https://https://`) | Đã sửa thành trang xóa tài khoản chuẩn trong CMS Admin. |
| **4** | `https://southpolemob.com/video/*.mp4` | `GET` | CDN tải 9 video hướng dẫn sử dụng tính năng | Tên video | Binary Video MP4 | ✅ Tạm thời dùng được | Đã tích hợp Cloudflare R2 quản lý đồng bộ. |

---

## 2.2 Bảng API Bên Thứ Ba (Third-Party Services)

| Dịch Vụ | Tên Miền / Endpoints | Mục Đích Sử Dụng | Giải Pháp Trong Bản Mới |
|---|---|---|---|
| **Google Play Billing** | `play.google.com` | Quản lý gói đăng ký VIP | Google Play Billing Library 7.x |
| **Google Drive API** | `www.googleapis.com/auth/drive` | Đọc/ghi tài liệu Google Drive | OAuth 2.0 Scoped Storage Picker |
| **Microsoft Graph** | `graph.microsoft.com`, `login.microsoftonline.com` | Đồng bộ OneDrive | MSAL Android SDK |
| **AI LLM Gateway** | `api.openai.com` / Gemini API | Trợ lý tóm tắt & sửa văn bản | Chuyển tiếp qua Backend Gateway Port 6033 (giấu API Key) |
