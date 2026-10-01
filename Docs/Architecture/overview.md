# KIẾN TRÚC TỔNG THỂ HỆ THỐNG (DOCS/ARCHITECTURE/OVERVIEW.MD)

## 1. Sơ Đồ Khối Kiến Trúc Hệ Sinh Thái

```
+-------------------------------------------------------------------------------+
|                        NEXTAI OFFICE SUITE ECOSYSTEM                         |
+-------------------------------------------------------------------------------+
                                       |
       +-------------------------------+-------------------------------+
       |                                                               |
       v                                                               v
+------------------------------------+               +------------------------------------+
|         ANDROID NATIVE APP         |               |         CMS WEB ADMIN PORTAL       |
| (Kotlin 2.0 + Jetpack Compose M3)  |               |  (Glassmorphism, Dark/Light, Card) |
| Package: com.nextaitechnology...   |               |   URL: domain.com/admin/parent/... |
+------------------------------------+               +------------------------------------+
       |                  |                                            |
       | HTTP/TLS 1.3     | Local Wi-Fi (WebDAV / HTTPS + PIN)         | HTTP/TLS 1.3 (Port 6033)
       v                  v                                            v
+---------------------------------------------------------------------------------+
|                    BACKEND & MICROSERVICES (PORT: 6033)                         |
|                                                                                 |
|  +--------------------+  +--------------------+  +---------------------------+  |
|  | Conversion Service |  | S2S IAP & Fraud API|  | AI Assistant Gateway      |  |
|  | (LibreOffice / Go) |  | (Google Play API)  |  | (OpenAI / Gemini Models)  |  |
|  +--------------------+  +--------------------+  +---------------------------+  |
|  +--------------------+  +--------------------+  +---------------------------+  |
|  | Cloudflare R2 Sync |  | Device / User Auth |  | Swagger OpenAPI Docs      |  |
|  | (Zero Orphan Files)|  | (JWT + RBAC)       |  | (Interactive at /docs)    |  |
|  +--------------------+  +--------------------+  +---------------------------+  |
+---------------------------------------------------------------------------------+
                                       |
       +-------------------------------+-------------------------------+
       |                                                               |
       v                                                               v
+------------------------------------+               +------------------------------------+
|       RELATIONAL DB (PostgreSQL)   |               |       OLAP / ANALYTICS (DuckDB)    |
| Users, Devices, Subscriptions,     |               | Telemetry, Retention Events,       |
| Conversion Jobs, Media Catalog     |               | Document Reading Metrics           |
+------------------------------------+               +------------------------------------+
```

## 2. Các Luồng Dữ Liệu Trọng Tâm

1. **Luồng Chuyển Đổi Tài Liệu (Document Conversion Flow):**
   - Android Client tải file (HWP, DOCX, etc.) lên `POST /api/v1/convert` qua Multipart kèm token xác thực.
   - Backend phân công Conversion Worker (Node.js/Go) xử lý.
   - File kết quả được lưu tạm có thời hạn và trả về `downloadUrl` an toàn.

2. **Luồng Xác Thực Gói Mua S2S (IAP Verification Flow):**
   - Khi user mua hàng qua Google Play Billing, Android nhận `purchaseToken`.
   - Android Client gửi event `POST /api/v1/android-event` lên Backend.
   - Backend gọi Google Play Developer API xác thực đơn hàng, lưu trạng thái kích hoạt VIP và phản hồi cho client.

3. **Luồng Trợ Lý AI Văn Phòng (AI Assistant Flow):**
   - User yêu cầu tóm tắt/viết/sửa tài liệu trên Android App.
   - Client gửi prompt qua `POST /api/v1/ai/chat` (hoặc `/summarize`).
   - Backend kiểm tra quota, chuyển tiếp prompt tới LLM API (OpenAI/Gemini) an toàn mà không làm lộ API Key trên Mobile Client.
