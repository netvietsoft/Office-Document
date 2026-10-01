# QUY CHUẨN MÃ NGUỒN VÀ VẬN HÀNH (DOCS/RULES.MD)

> **Dự án:** NextAI Office Suite
> **Tiêu chuẩn:** Development Workspace Standard V2.1
> **Ngôn ngữ bắt buộc trong comment:** Tiếng Việt + Tiếng Anh (Song ngữ)

---

## 1. Tiêu Chuẩn Frontend (Android Native Kotlin)

- **Language:** Kotlin 2.0+ (100% Kotlin, không dùng Java thuần cho code mới).
- **UI Toolkit:** Jetpack Compose (Material 3).
- **Architecture:** Clean Architecture + MVI/MVVM với Unidirectional Data Flow (StateFlow, SharedFlow).
- **Dependency Injection:** Dagger Hilt.
- **Database:** Room với SQLCipher encryption.
- **Network:** Retrofit 2 + OkHttp 3, Ktor Client, Certificate Pinning cho domain nhạy cảm.
- **Security & Storage:**
  - Scoped Storage (Storage Access Framework - SAF).
  - Không yêu cầu `MANAGE_EXTERNAL_STORAGE` trừ trường hợp mở rộng quản lý file nâng cao.
  - Tuyệt đối cấm cleartext traffic (`android:usesCleartextTraffic="false"`).
  - Không sử dụng Chucker/Debug inspector trong release build.
- **Comments & Documentation:** Mọi hàm/lớp đều có Docstring tiếng Anh + giải thích tiếng Việt.

---

## 2. Tiêu Chuẩn Backend & CMS (TypeScript + Go)

- **Runtime:** Node.js 20+ / TypeScript 5+, Go 1.22+.
- **Port:** **`6033`** (Cổng duy nhất phục vụ REST API + Swagger + CMS Admin).
- **Framework:** Express / Fastify với kiến trúc modular Router - Service - Repository.
- **Admin CMS UI:**
  - Thiết kế hiện đại: Glassmorphism, Theme Sáng / Tối (Dark/Light toggle).
  - Định tuyến URL phân cấp: `/admin/[menu-cha]/[menu-con]`.
  - Responsive Mobile: Với các bảng dữ liệu nhiều cột, trên mobile viewport chuyển sang hiển thị dạng thẻ (Card UI) linh hoạt.
  - Phân quyền: JWT Authentication + Role-Based Access Control (RBAC).
- **Cloudflare R2 Integration:**
  - Tương thích AWS S3 SDK.
  - Khi xóa file/media trong CMS, bắt buộc gọi API xóa đồng bộ trên Cloudflare R2 bucket để tránh file mồ côi (orphan files).
- **API Documentation:** OpenAPI 3.0 (Swagger UI) tại `/docs`.

---

## 3. Quy Ước Đặt Tên & Cấu Trúc

- **Biến và Hàm:** `camelCase` (ví dụ: `convertDocument()`, `purchaseToken`).
- **Lớp và Component:** `PascalCase` (ví dụ: `DocumentViewerScreen`, `ConversionService`).
- **Hằng số:** `UPPER_SNAKE_CASE` (ví dụ: `DEFAULT_PORT = 6033`).
- **File & Thư mục:** `kebab-case` hoặc `snake_case` tùy quy ước nền tảng.
- **Git Commit Message:** `type(scope): subject` (ví dụ: `feat(android): add compose document viewer`).
