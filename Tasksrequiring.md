# BẢNG TÀI NGUYÊN & CẤU HÌNH CẦN CUNG CẤP (TASKSREQUIRING.MD)

> **Mục đích:** Thống kê toàn bộ các thông số cấu hình, API Keys, App IDs, Credentials, Subscription Pricing cần thiết để triển khai sản phẩm lên môi trường Production.
> **Trạng thái:** Toàn bộ codebase đã được cấu hình giá trị **Demo / Fallback an toàn**, người dùng chỉ cần cập nhật các giá trị này khi phát hành chính thức.

---

## 1. Bảng Khóa Dịch Vụ & Mạng Quảng Cáo (AdMob & Mediation)

| Hạng mục | Giá trị Chính Thức Đã Tích Hợp (`Admob.txt`) | Vị trí cấu hình trong Code | Trạng thái | Ghi chú |
|---|---|---|---|---|
| **AdMob App ID** | `ca-app-pub-4108090245719282~6716648202` | `AndroidManifest.xml` & `AdMobConfig.kt` | ✅ Đã tích hợp | Mã ứng dụng AdMob chính thức của dự án |
| **Adaptive Banner Unit** | `ca-app-pub-4108090245719282/1073081463` | `AdMobConfig.kt` / `AdaptiveBannerAd.kt` | ✅ Đã xác thực | Neo đáy MainScreen, DocumentViewer, PdfTools |
| **Interstitial (Full) Unit** | `ca-app-pub-4108090245719282/7927843439` | `AdMobConfig.kt` / `AdManager.kt` | ✅ Đã xác thực | Tải trước tự động, mở/thoát tài liệu, quét scan |
| **Native Advanced Unit** | `ca-app-pub-4108090245719282/7816162790` | `AdMobConfig.kt` / `NativeAdCard.kt` | ✅ Đã xác thực | Chèn xen kẽ thẻ tài liệu trong danh sách |
| **App Open Unit** | `ca-app-pub-4108090245719282/1222834282` | `AdMobConfig.kt` / `AdManager.kt` | ✅ Đã xác thực | Tự động kích hoạt khi mở app (cold start / resume) |
| **AppLovin SDK Key** | `APPLOVIN_SDK_KEY_PLACEHOLDER` | `AndroidManifest.xml` | Tùy chọn | Dùng nếu kết nối thác quảng cáo AppLovin MAX |


---

## 2. Bảng Cấu Hình Firebase & Google Services (Đã Tích Hợp)

| Hạng mục | Giá trị Đã Cung Cấp & Tích Hợp | Vị trí cấu hình trong Code | Trạng thái | Ghi chú |
|---|---|---|---|---|
| **Package Name** | `com.officedocument.word.docx.xlsx.viewer` | `app/build.gradle.kts` | ✅ Đã cấu hình | Đồng bộ theo `CONVERT/Info/info.txt` |
| **Google API Key** | `AIzaSyDHEBlAfP9tpYZ6hjjUZBSoOpwJrsl0MX0` | `google-services.json` | ✅ Hoạt động | Cung cấp tại `CONVERT/Info/google-services.json` |
| **Google App ID** | `1:835484781784:android:75f31070eda18fd0079bad` | `google-services.json` | ✅ Hoạt động | Project: `office-document-ed484` |
| **Firebase Crashlytics** | BoM `33.2.0` / Plugin `3.0.2` | `app/build.gradle.kts` | ✅ Đã tích hợp | Tự động ghi nhận crash reports & non-fatal errors |
| **FCM / Project Number** | `835484781784` | `google-services.json` | ✅ Hoạt động | Project Number Google Cloud |
| **OAuth Web Client ID** | `732512160382-qr7t8ldamp8ujsqgh33l246sunf6ags2...` | `CONVERT/Android/.../cloud/GoogleDriveManager.kt` | Chờ cập nhật | Cấu hình OAuth 2.0 Client ID cho Google Drive |

---

## 2b. Khóa Ký Số Phát Hành (Release Keystore - Đã Đồng Bộ & Xác Thực Chuẩn Google Play)

| Thông Số | Giá Trị Cấu Hình | Vị Trí File | Ghi Chú Bảo Mật |
|---|---|---|---|
| **Keystore File** | `release.jks` (đồng bộ từ `cleaner-release.jks`) | `CONVERT/Android/keystore/release.jks` & `CONVERT/Info/release.jks` | PKCS12 / RSA 2048-bit, hiệu lực đến năm 2054 |
| **Owner** | `CN=NextAITechnology, OU=Mobile, O=NextAI, L=SanFrancisco, ST=CA, C=US` | Chứng chỉ gốc tổ chức NextAI | Khớp 100% tài khoản Google Play Console |
| **Key Alias** | `cleaner_release_key` | `app/build.gradle.kts` | Alias dùng để ký AAB Release phát hành |
| **Store Password** | `CleanApp2026SecureRelease!` | `app/build.gradle.kts` | Mật khẩu kho khóa bảo mật |
| **Key Password** | `CleanApp2026SecureRelease!` | `app/build.gradle.kts` | Mật khẩu khóa riêng |
| **Certificate SHA-1** | `DE:92:78:5B:C9:E5:64:84:30:37:B2:44:46:74:03:81:ED:77:D4:A4` | Xác thực qua `keytool -printcert` | Khớp 100% yêu cầu Google Play Console |
| **Certificate SHA-256**| `97:3E:EA:F1:45:E9:90:3F:20:1F:69:4F:31:22:E3:E6:9F:89:80:61:2F:53:67:82:0A:AA:4B:46:7B:1F:B6:30` | Chuẩn ký số bảo mật SHA256withRSA | Bảo vệ toàn vẹn gói ứng dụng |
| **AAB Output** | `OfficeDocument_v2.1.7_311208_release.aab` (**~9.33 MB**, versionCode **311208**, versionName **2.1.7**, Target SDK **36**, 0 file .so, 16 KB Memory Page Sizes 100% Compliant) | [CONVERT/Info/app-release.aab](file:///F:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/CONVERT/Info/app-release.aab) & `Desktop/OfficeDocument_v2.1.7_311208_release.aab` | Đã ký, sẵn sàng 100% cho Google Play Console |


---

## 3. Bảng Cấu Hình Backend, Cloudflare R2 & AI Gateway (Port 1500)

| Biến Môi Trường (Env) | Giá trị Hiện Tại | File cấu hình | Trạng thái | Ghi chú |
|---|---|---|---|---|
| `PORT` | `1500` | `CONVERT/Backend/.env` | ✅ Đang chạy | Cổng dịch vụ Backend & CMS Web Admin |
| `JWT_SECRET` | `nextai_jwt_super_secret_key_change_in_production_2026` | `CONVERT/Backend/.env` | ✅ Hoạt động | Khóa bí mật ký JWT Token đăng nhập Admin |
| `CLOUDFLARE_R2_ACCOUNT_ID` | `53b5f77f5f06c19bfac082c94752709f` | `CONVERT/Backend/.env` | ✅ Đã cấu hình | Account ID Cloudflare của Chủ Tịch |
| `CLOUDFLARE_R2_ACCESS_KEY` | `d2fc05a43ffcb8cdc58183c299f63228` | `CONVERT/Backend/.env` | ✅ Đã cấu hình | R2 API Token Access Key |
| `CLOUDFLARE_R2_SECRET_KEY` | `(Đã bảo mật theo chuẩn Hiến Pháp)` | `CONVERT/Backend/.env` | ✅ Đã cấu hình | R2 API Token Secret Key |
| `CLOUDFLARE_R2_BUCKET` | `office-document` | `CONVERT/Backend/.env` | ✅ Đã cấu hình | Bucket lưu trữ media file |
| `CLOUDFLARE_R2_ENDPOINT` | `https://53b5f77f5f06c19bfac082c94752709f.r2.cloudflarestorage.com` | `CONVERT/Backend/.env` | ✅ Đã cấu hình | Endpoint S3 tương thích Cloudflare R2 |
| `GEMINI_API_KEY` | `AQ.Ab8RN... (Đã xác thực Google Cloud)` | `CONVERT/Backend/.env` | ✅ Đang hoạt động 100% | Gọi model `gemini-3.5-flash-lite`, phản hồi thời gian thực |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`| `./config/google-service-account.json` | `CONVERT/Backend/config/` | Sẵn sàng | File JSON service account xác thực IAP S2S |

---

## 4. Bảng Định Giá Gói Sub / IAP Products (Khớp 100% với BillingManager.kt & Play Console)

| Product ID (Mã Sản Phẩm) | Base Plan ID (Mã Gói Cơ Bản) | Phân Loại trên Play Console | Thời Hạn | Dùng Thử (Free Trial) | Giá Đề Xuất (USD / VND) | Quyền Lợi & Mô Tả |
|---|---|---|---|---|---|---|
| **`pro_yearly`** | `pro-yearly-base` | **Subscriptions** (Gói thuê bao) | 1 Năm (Yearly) | 3 Ngày (Tùy chọn) | $39.99 / 899.000 ₫ | Gói Năm (Tiết kiệm 70%), Chặn 100% Ads, Full PDF Tools, OCR |
| **`pro_monthly`** | `pro-month-base` | **Subscriptions** (Gói thuê bao) | 1 Tháng (Monthly) | Không | $14.99 / 349.000 ₫ | Gói Tháng (Phổ biến), Chặn 100% Ads, Linh hoạt từng tháng |
| **`pro_weekly`** | `pro-weekly-base` | **Subscriptions** (Gói thuê bao) | 1 Tuần (Weekly) | Không | $4.99 / 119.000 ₫ | Gói Tuần (Linh hoạt), Hủy bất kỳ lúc nào trên Google Play |
| **`pro_lifetime`** | — | **In-app products** (Mua 1 lần) | Trọn đời (Lifetime) | Không | $79.99 / 1.890.000 ₫ | Mua 1 lần sở hữu vĩnh viễn, không gia hạn định kỳ |

---

## 5. Cấu Hình Chính Sách Quyền Riêng Tư (Privacy Policy cho Google Play Console)

| Mục | Giá Trị Cần Cung Cấp / Đã Soạn Thảo | Vị Trí / Thao Tác | Trạng Thái |
|---|---|---|---|
| **Chính Sách Bản Markdown** | [`Docs/Legal/PRIVACY_POLICY.md`](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/Docs/Legal/PRIVACY_POLICY.md) | Lưu trong mã nguồn dự án | ✅ Đã soạn thảo chuẩn |
| **Chính Sách Bản HTML** | [`Docs/Legal/privacy_policy.html`](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/Docs/Legal/privacy_policy.html) | Lưu trong mã nguồn dự án | ✅ Đã tạo giao diện đẹp |
| **URL Chính Sách Chính Thức** | `https://netvietgroups.com/privacy-and-policy-office-document/` | Nhập vào Google Play Console > App content > Privacy Policy | ✅ Đã cấu hình và cập nhật vào app |
| **App Name & Package ID** | `Office Document: Word, PDF, XLSX` (`com.officedocument.word.docx.xlsx.viewer`) | Khớp chính xác với Play Store Listing | ✅ Khớp 100% |
| **Developer Information** | `Surgio Killa` / `Phạm Thị Phương Thảo` / `ms13killla@gmail.com` | Khớp thông tin tài khoản phát triển | ✅ Khớp 100% |
