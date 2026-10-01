# DESIGN SYSTEM & UI SPECIFICATIONS (DOCS/DESIGN/DESIGN_SYSTEM.MD)

> **Mục tiêu:** Định nghĩa toàn bộ Design Tokens, Palette màu, Typography, Component Guidelines và quy tắc Responsive Mobile Card cho cả ứng dụng Android Jetpack Compose và Web CMS Admin.

---

## 1. Bảng Màu (Color Palette)

### Primary & Brand Colors
- **Primary Navy:** `#1A365D` (Chủ đạo, tin cậy, thanh lịch)
- **Primary Blue:** `#2B6CB0` (Nút CTA, active state, link)
- **Accent Emerald:** `#38A169` (Trạng thái VIP, thành công, an toàn)
- **Accent Amber:** `#D69E2E` (Cảnh báo, huy hiệu dùng thử, sale banner)
- **Danger Red:** `#E53E3E` (Xóa, lỗi, cảnh báo bảo mật)

### Document Type Distinct Colors
- **Word / DOCX:** `#2B579A` (Xanh Word đặc trưng)
- **Excel / XLSX:** `#217346` (Xanh lá Excel đặc trưng)
- **PowerPoint / PPTX:** `#D24726` (Cam Đỏ PowerPoint đặc trưng)
- **PDF:** `#E02B20` (Đỏ PDF đặc trưng)
- **HWP (Hancom):** `#0096D6` (Xanh lam HWP đặc trưng)
- **Text / TXT / Code:** `#4A5568` (Xám chì)

### Neutral & Surface Colors (Dark / Light Theme)
- **Light Background:** `#F7FAFC`
- **Light Surface / Card:** `#FFFFFF` (Border: `#E2E8F0`)
- **Light Text Primary:** `#1A202C`
- **Light Text Secondary:** `#718096`

- **Dark Background:** `#0F172A`
- **Dark Surface / Card:** `#1E293B` (Border: `#334155`)
- **Dark Text Primary:** `#F8FAFC`
- **Dark Text Secondary:** `#94A3B8`

---

## 2. Typography Scale

- **Display Large:** 32sp / Bold (Màn hình Splash, Banner Khuyến Mãi)
- **Title Medium:** 18sp / SemiBold (Tiêu đề tài liệu, Tên mục Admin)
- **Body Large:** 16sp / Regular (Nội dung văn bản, bảng dữ liệu)
- **Body Small:** 12sp / Medium (Dung lượng file, ngày sửa đổi, metadata)

---

## 3. Quy Tắc Giao Diện Web Admin CMS

1. **Hiệu Ứng Kính Mờ (Glassmorphism):**
   - Header, Sidebar và Card sử dụng `backdrop-filter: blur(12px)` kết hợp `rgba` background và viền mỏng `1px solid rgba(255,255,255,0.1)`.
2. **Cấu Trúc URL Chuẩn:**
   - `/admin/dashboard`
   - `/admin/users/list`, `/admin/users/edit/:id`
   - `/admin/devices/list`
   - `/admin/media/library` (Tích hợp Cloudflare R2)
   - `/admin/conversions/queue`
   - `/admin/monetization/plans`
   - `/admin/settings/general`
3. **Responsive Mobile Card Layout:**
   - Trên Desktop (>= 768px): Hiển thị dạng bảng (Data Table) đầy đủ cột.
   - Trên Mobile (< 768px): Bảng tự động ẩn và chuyển thành danh sách các Thẻ (Card Component), hiển thị trực quan thông tin quan trọng mà không bị tràn ngang màn hình.
