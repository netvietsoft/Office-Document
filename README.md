# NextAI Office Suite - Full-Stack Workspace & Reconstruction

> **Dự án:** Hệ sinh thái văn phòng NextAI Office Suite (Android Native Kotlin + Jetpack Compose & Backend/CMS TypeScript + Go).
> **Tái dựng từ:** "Office App" (`com.officedocument.word.docx.document.viewer`).
> **Tiêu chuẩn Workspace:** [Development Workspace Standard V2.1](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/Development_Workspace_Standard_V2.1_Design_Gated.txt)
> **Tổ chức:** NextAI Technology (`nextaitechnology`)
> **Package ID:** `com.nextaitechnology.officedocument`

---

## 1. Giới Thiệu Tổng Quan

NextAI Office Suite là giải pháp văn phòng toàn diện, bảo mật cao và hiện đại, cung cấp:
- **Android App:** Đọc & chỉnh sửa Word (DOC/DOCX), Excel (XLS/XLSX), PowerPoint (PPT/PPTX), PDF, HWP, TXT, EPUB.
- **Công cụ PDF Nâng Cao:** Ghép PDF (Merge), Tách PDF (Split), Chèn Watermark, Ký điện tử (Signature), Đặt mật khẩu bảo vệ.
- **Document Scanner:** Quét tài liệu bằng CameraX, tự động nhận diện mép tài liệu (Edge Detection) và nhận dạng chữ OCR bằng ML Kit.
- **Trợ Lý AI Văn Phòng:** Tóm tắt tài liệu, sửa ngữ pháp chính tả, viết văn bản tự động, dịch thuật đa ngôn ngữ.
- **Chia Sẻ Tệp Nội Bộ Bảo Mật:** Chia sẻ tài liệu qua Wi-Fi nội bộ bằng WebDAV/HTTPS có mã PIN xác thực (thay thế FTP cleartext không an toàn).
- **Backend & CMS Web Admin:** Phục vụ trên cổng **`6033`**, bao gồm API chuyển đổi tài liệu, xác thực IAP S2S chống gian lận, Gateway AI, tích hợp Cloudflare R2 quản lý file đồng bộ và Web Admin CMS giao diện Glassmorphism hiện đại (hỗ trợ Light/Dark mode, responsive Mobile).

---

## 2. Cấu Trúc Thư Mục

```
.
├── AGENTS.md                                  # Hiến pháp vận hành dành cho AI Agents
├── README.md                                  # Giới thiệu tổng quan & hướng dẫn cài đặt
├── CLAUDE.md / .clinerules                    # Điều hướng AI Tooling
├── UPDATETODOS.md                             # Bảng theo dõi tiến độ tổng thể
├── PROJECT_MEMORY.md                          # Bộ nhớ vận hành & mapping kiến trúc
├── TASK_LOG.md                                # Nhật ký thực thi của các Agent
├── Tasksrequiring.md                          # Bảng tài nguyên/khóa cấu hình cần bổ sung
├── .agents/                                   # Antigravity adapter layer
├── .ai/                                       # Trạng thái, locks, tasks & schemas
├── Docs/                                      # Tài liệu kiến trúc, API contracts, specs
├── CONVERT/
│   ├── Android/                               # Ứng dụng Android Native (Kotlin + Compose)
│   └── Backend/                               # Backend Server & CMS Web Admin (Port 6033)
├── Demo Data/                                 # Dữ liệu mẫu CSV, Schema SQL & Queries SQL
├── Report/                                    # Báo cáo phân tích chuyên sâu (26 mục)
└── scripts/                                   # Kịch bản kiểm thử tự động (ADB, Verification)
```

---

## 3. Hướng Dẫn Khởi Chạy

### 3.1 Khởi Chạy Backend & CMS Web Admin (Port 6033)
```bash
# Di chuyển vào thư mục Backend
cd CONVERT/Backend

# Cài đặt dependencies
npm install

# Khởi chạy server ở chế độ phát triển
npm run dev

# Mở trình duyệt truy cập:
# - CMS Web Admin: http://localhost:6033/admin/dashboard
# - Swagger API Docs: http://localhost:6033/docs
```

### 3.2 Build & Chạy Ứng Dụng Android
```bash
# Di chuyển vào thư mục Android
cd CONVERT/Android

# Build Debug APK
./gradlew assembleDebug

# Cài đặt & chạy tự động qua script ADB
powershell -ExecutionPolicy Bypass -File ../../scripts/adb-test-suite.ps1
```

---

## 4. Tài Liệu Tham Chiếu Canonical

- [Quy chuẩn mã nguồn (Docs/rules.md)](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/Docs/rules.md)
- [Kiến trúc hệ thống (Docs/Architecture/)](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/Docs/Architecture/overview.md)
- [Hợp đồng API OpenAPI (Docs/Contracts/openapi.yaml)](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/Docs/Contracts/openapi.yaml)
- [Báo cáo phân tích decompile & bảo mật (Report/)](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/Report/README.md)
