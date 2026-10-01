# 7. Báo Cáo Thống Kê Tài Nguyên Cần Cung Cấp

> **Mục đích:** Thống kê chi tiết toàn bộ các tài nguyên, credentials, API keys, package names cần chuẩn bị để phát hành ứng dụng lên môi trường Production.

---

## 1. Bảng Khóa Dịch Vụ Mạng Quảng Cáo (AdMob / AppLovin MAX)

| Hạng mục | Giá trị Decompiled / Mặc định | Trạng thái hiện tại trong Code | Mức độ nhạy cảm | Vị trí cấu hình | Hướng dẫn chuẩn bị |
|---|---|---|---|---|---|
| **AdMob App ID** | `ca-app-pub-7680355516803423~4086483031` | Cấu hình test ID an toàn | Trung bình | `AndroidManifest.xml` | Đăng ký tài khoản Google AdMob và tạo App ID mới |
| **Interstitial Ad Unit** | `ca-app-pub-3940256099942544/1033173712` (Test) | Hoạt động ở chế độ Demo | Thấp | `AdConfig.kt` | Tạo Ad Unit toàn màn hình trên AdMob Console |
| **Native Ad Unit** | `ca-app-pub-3940256099942544/2247696110` (Test) | Hoạt động ở chế độ Demo | Thấp | `AdConfig.kt` | Tạo Native Ad Unit chèn vào danh sách tài liệu |
| **Banner Ad Unit** | `ca-app-pub-3940256099942544/6300978111` (Test) | Hoạt động ở chế độ Demo | Thấp | `AdConfig.kt` | Tạo Banner Ad Unit chân trang |
| **AppLovin SDK Key** | `APPLOVIN_SDK_KEY_DEMO` | Đã trừu tượng hóa | Trung bình | `AdConfig.kt` | Cung cấp nếu sử dụng Mediation AppLovin MAX |

---

## 2. Bảng Cấu Hình Firebase & Google Services

| Hạng mục | Giá trị Decompiled | Trạng thái trong Code | Mức độ nhạy cảm | Hướng dẫn chuẩn bị |
|---|---|---|---|---|
| **Google API Key** | `AIzaSyC9l02Oqbt3JolJBwic0rt7rReZ5fZIBNg` | Cần thay thế | Cao | Tạo dự án Firebase mới, giới hạn SHA-1 và Package Name |
| **Google App ID** | `1:732512160382:android:e0ac0f413c7257deb2262f` | Cần thay thế | Trung bình | Tải file `google-services.json` từ Firebase Console |
| **FCM Sender ID** | `732512160382` | Cần thay thế | Thấp | Lấy Cloud Messaging Sender ID từ Google Cloud |
| **OAuth Client ID** | `732512160382-qr7t8ldamp8ujsqgh33l246sunf6ags2.apps.googleusercontent.com` | Cần thay thế | Cao | Cấu hình OAuth 2.0 Web Client cho Google Drive |

---

## 3. Bảng Cấu Hình Backend & Cloudflare R2 (Cổng 6033)

| Biến Môi Trường (.env) | Giá trị Mặc Định / Demo | Vai trò & Hướng dẫn |
|---|---|---|
| `PORT` | `6033` | Cổng dịch vụ Backend & CMS Web Admin |
| `JWT_SECRET` | `nextai_jwt_super_secret_key_change_in_production_2026` | Khóa bí mật ký token đăng nhập Admin CMS |
| `CLOUDFLARE_R2_ACCOUNT_ID` | `demo_cloudflare_account_id` | Lấy từ Cloudflare R2 Dashboard |
| `CLOUDFLARE_R2_ACCESS_KEY` | `demo_r2_access_key_id` | Tạo API Token R2 có quyền đọc/ghi/xóa |
| `CLOUDFLARE_R2_SECRET_KEY` | `demo_r2_secret_access_key` | Khóa Secret của API Token R2 |
| `CLOUDFLARE_R2_BUCKET` | `nextai-office-media` | Tên R2 bucket lưu trữ video tutorial và template |
| `CLOUDFLARE_R2_PUBLIC_URL` | `https://media.nextaitechnology.com` | Tên miền CDN phân phối tệp |
| `OPENAI_API_KEY` | `sk-demo-ai-proxy-key-replace-with-real-key` | API Key OpenAI hoặc Gemini API cho tính năng AI |

---

## 4. Bảng Định Giá Gói Sub / IAP Products (Google Play Billing)

| Product ID | Tên Gói Hiển Thị | Thời Hạn | Dùng Thử (Trial) | Giá Đề Xuất (USD) | Giá Đề Xuất (VND) |
|---|---|---|---|---|---|
| `office_sub_weekly_trial` | NextAI Pro Weekly | 1 Tuần | 3 Ngày | $4.99 | 119.000 đ |
| `office_sub_monthly` | NextAI Pro Monthly | 1 Tháng | Không | $9.99 | 249.000 đ |
| `office_sub_yearly_best` | NextAI Pro Yearly | 1 Năm | 3 Ngày | $39.99 | 899.000 đ |
| `office_lifetime_vip` | NextAI Lifetime VIP | Trọn đời | Không | $79.99 | 1.890.000 đ |
