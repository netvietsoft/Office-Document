# 9. Báo Cáo Sơ Đồ Flow Màn Hình & Phân Cấp Menu, Tab Ứng Dụng

> **Mục đích:** Mô tả trực quan luồng điều hướng (User Flow), sơ đồ chuyển đổi màn hình và phân cấp cấu trúc menu cha - con từ ứng dụng gốc.

---

## 1. Sơ Đồ Luồng Người Dùng (Screen Flow Diagram)

```mermaid
graph TD
    A[Splash / Launcher] --> B{First Launch?}
    B -- Yes --> C[Intro / Onboarding Screen]
    C --> D[Paywall Promotion Dialog]
    D --> E[Main Dashboard Screen]
    B -- No --> E

    E --> F[Document Viewer Screen]
    E --> G[Document Scanner OCR]
    E --> H[AI Assistant Chat]
    E --> I[PDF Advanced Tools]
    E --> J[Secure Wi-Fi Transfer]
    E --> K[Settings & Premium Screen]

    F --> L[Document Editor Toolbar]
    F --> H
    F --> M[Export / Convert to PDF]

    I --> N[Merge PDF Flow]
    I --> O[Split PDF Flow]
    I --> P[Electronic Signature Flow]
    I --> Q[Add Watermark Flow]
```

---

## 2. Danh Sách Phân Cấp Menu & Tab (Từ Cha Xuống Con)

| Menu Cha (Parent Menu) | Menu Con (Child Menu) | Chức Năng Chi Tiết |
|---|---|---|
| **1. Trang Chủ (Home)** | - **Thanh Tìm Kiếm (Search Bar)**<br>- **Khối Phím Tắt Nhanh (Quick Actions)**<br>- **Bộ Lọc Loại File (DocType Chips)**<br>- **Danh Sách Tài Liệu (Document List)** | - Tìm kiếm theo tên file & nội dung OCR<br>- Mở nhanh AI, Scanner, PDF Tools, Transfer<br>- Lọc DOCX, XLSX, PPTX, PDF, HWP, TXT<br>- Mở file, đánh dấu sao, xem dung lượng & ngày sửa |
| **2. Gần Đây (Recent)** | - **Lịch Sử Đọc (Last Opened)**<br>- **Mục Đánh Dấu Sao (Favorites)** | - Danh sách file sắp xếp theo thời gian mở gần nhất<br>- Lọc nhanh các tài liệu quan trọng đã bookmark |
| **3. Công Cụ (Tools)** | - **Document Scanner OCR**<br>- **Merge & Split PDF**<br>- **Sign & Watermark PDF**<br>- **Convert Document**<br>- **Secure Wi-Fi Transfer** | - Chụp scan tài liệu từ camera và xuất PDF<br>- Ghép nhiều file PDF hoặc tách trang<br>- Vẽ chữ ký điện tử hoặc chèn watermark<br>- Chuyển đổi HWP/Word sang PDF/DOCX<br>- Phát Wi-Fi WebDAV chia sẻ file sang PC |
| **4. Trợ Lý AI (AI Chat)** | - **Tóm Tắt Văn Bản (Summarize)**<br>- **Sửa Lỗi Chính Tả (Grammar)**<br>- **Dịch Thuật Đa Ngôn Ngữ (Translate)**<br>- **Hỏi Đáp Tự Do (Chat)** | - Rút trích 3-5 luận điểm chính của tài liệu<br>- Rà soát chính tả, cấu trúc câu tiếng Việt/Anh<br>- Dịch nội dung tài liệu sang ngôn ngữ đích<br>- Trả lời các câu hỏi dựa trên ngữ cảnh file |
| **5. Cài Đặt (Settings)** | - **Gói VIP Pro (Premium Banner)**<br>- **Ngôn Ngữ (Language Switcher)**<br>- **Chế Độ Nền Tối (Dark Theme)**<br>- **Xóa Bộ Nhớ Đệm (Clear Cache)**<br>- **Chính Sách & Điều Khoản (Legal)** | - Xem trạng thái VIP, nâng cấp hoặc khôi phục đơn mua<br>- Chọn Tiếng Việt, English, Korean, Japanese...<br>- Bật/Tắt Dark Mode tiết kiệm pin<br>- Dọn dẹp các tệp tạm đã convert<br>- Xem Privacy Policy và Terms of Service |
