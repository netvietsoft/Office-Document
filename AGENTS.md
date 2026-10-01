# AGENTS.md - Hiến Pháp Điều Hành AI Agent (Workspace Standard V2.1)

> **Nguyên tắc cốt lõi:** Một hệ luật, một nguồn trạng thái vận hành, một pipeline hợp nhất.
> **Dự án:** NextAI Office Suite (Tái dựng từ APK "Office App" sang Native Kotlin + Jetpack Compose & Full-Stack Backend/CMS).
> **Tổ chức:** NextAI Technology (`nextaitechnology`).
> **Package đích:** `com.nextaitechnology.officedocument`

---

## 1. Thứ Tự Bắt Buộc Khi Bắt Đầu Task

Mọi AI Agent khi nhận lệnh đều **bắt buộc** thực hiện tuần tự:

1. Đọc [README.md](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/README.md) để nắm bức tranh toàn cảnh dự án.
2. Đọc [AGENTS.md](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/AGENTS.md) (file này).
3. Đọc [Docs/rules.md](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/Docs/rules.md) để tuân thủ quy chuẩn coding.
4. Đọc tài liệu kiến trúc liên quan trong [Docs/Architecture/](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/Docs/Architecture/).
5. Kiểm tra file locks tại `.ai/locks.json` trước khi chỉnh sửa file.
6. Kiểm tra git status & branch/worktree đang thao tác.
7. Không sửa file ngoài phạm vi task được giao.
8. Không bắt đầu code nếu chưa hiểu rõ Acceptance Criteria (Tiêu chí nghiệm thu).
9. Mọi đoạn code, hàm, module, class **bắt buộc có chú thích song ngữ (Tiếng Việt + Tiếng Anh)**.
10. Cập nhật tiến độ vào [UPDATETODOS.md](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/UPDATETODOS.md), nhật ký thực thi vào [TASK_LOG.md](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/TASK_LOG.md) và bộ nhớ dự án vào [PROJECT_MEMORY.md](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/PROJECT_MEMORY.md).
11. Bổ sung các cấu hình cần người dùng cung cấp vào [Tasksrequiring.md](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/Tasksrequiring.md).

---

## 2. Quy Tắc Kỹ Thuật Bắt Buộc (Rules of Engagement)

### 2.1 Không Sửa Test Để "Làm Xanh"
- Tuyệt đối không được sửa đổi assertion trong unit test để che giấu lỗi code. Nếu test fail, phải sửa logic source code.

### 2.2 Không Bịa Đặt Dữ Liệu
- Phân biệt rõ:
  - **Dữ liệu quan sát được (Observed Evidence):** Trích xuất trực tiếp từ file decompile/smali/resources.
  - **Dữ liệu suy luận (Inferred):** Có cơ sở logic từ luồng nghiệp vụ.
  - **Thiết kế mới (New Design):** Các cải tiến kiến trúc hiện đại.

### 2.3 Tiêu Chuẩn Mã Nguồn
- **Android:** Kotlin 2.0+, Jetpack Compose (Material 3), Clean Architecture, MVI/MVVM, Flow/Coroutines, Dagger Hilt, Room Database, Scoped Storage SAF.
- **Backend & CMS:** TypeScript (Node.js/Express) + Go microservice cho conversion engine, REST API + Swagger UI, phục vụ trên cổng **`6033`**.
- **Package Name:** Không dùng package cũ, sử dụng `com.nextaitechnology.officedocument`.
- **Security First:**
  - Cấm cleartext HTTP traffic trong release build.
  - Cấm chạy Chucker/HTTP inspectors trong production build.
  - Loại bỏ hoàn toàn FTP server cleartext không xác thực; thay bằng Secure Local File Sharing (WebDAV/HTTPS + PIN auth).
  - Khắc phục lỗ hổng upload file tài liệu không an toàn.
  - Toàn bộ kết nối nhạy cảm phải có Certificate Pinning / TLS 1.3.

---

## 3. Phân Công Vai Trò Hệ Thống Agent

| Agent Role | Nhiệm vụ chính |
|---|---|
| **Agent 0: Orchestrator** | Điều phối toàn dự án, cập nhật `UPDATETODOS.md`, quản lý task dependencies. |
| **Agent 1: Architect** | Thiết kế kiến trúc tổng thể, database blueprints, API contracts. |
| **Agent 2: Frontend (Android)** | Xây dựng ứng dụng Android Native Kotlin + Compose Material 3. |
| **Agent 3: Backend & CMS** | Xây dựng REST API, Conversion Engine, CMS Web Admin (Port 6033). |
| **Agent 4: Security Specialist** | Audit bảo mật, loại bỏ lỗ hổng từ bản decompile, cấu hình credential guard. |
| **Agent 5: QA & Test Engineer** | Viết Unit Test, Playwright E2E cho CMS, script ADB tự động hóa trên Android. |

---

## 4. Cấu Trúc Báo Cáo & Trạng Thái

- Trạng thái công việc: `.ai/state.json` và [UPDATETODOS.md](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/UPDATETODOS.md).
- Nhật ký vận hành: [TASK_LOG.md](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/TASK_LOG.md).
- Báo cáo phân tích chuyên sâu: Thư mục `Report/` và `Docs/`.
- Tài nguyên cần người dùng cung cấp: [Tasksrequiring.md](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/Tasksrequiring.md).
