# 10. Báo Cáo Handoff Thiết Kế Lại Giao Diện (UI Redesign Handoff)

> **Mục đích:** Cung cấp đầy đủ thông số kỹ thuật (mã màu HEX, kích thước sp/dp, component layout XML -> Jetpack Compose tokens) để phục vụ việc thiết kế lại giao diện đạt độ hoàn thiện cao nhất.

---

## 1. Bảng Mã Màu Thiết Kế (Color Tokens)

| Token Tên | Giá Trị HEX | Ứng Dụng Trong Giao Diện | Ý Nghĩa / Mục Đích |
|---|---|---|---|
| `BrandPrimary` | `#2563EB` | Nút CTA chính, Tab đang chọn, Icon nổi bật | Màu xanh công nghệ hiện đại, tin cậy |
| `BrandAccent` | `#38A169` | Huy hiệu VIP, Trạng thái thành công, Nút Lưu | Màu xanh lá tích cực, an toàn |
| `BrandAmber` | `#F59E0B` | Huy hiệu Sale 70%, Sao yêu thích, Cảnh báo | Màu vàng cam thu hút sự chú ý |
| `BrandDanger` | `#EF4444` | Nút Xóa, Huỷ bỏ, Lỗi hệ thống | Màu đỏ cảnh báo |
| `DocWordColor` | `#2B579A` | Thẻ file DOCX / DOC | Nhận diện tài liệu Word |
| `DocExcelColor` | `#217346` | Thẻ file XLSX / XLS / CSV | Nhận diện tài liệu Excel |
| `DocPptColor` | `#D24726` | Thẻ file PPTX / PPT | Nhận diện tài liệu PowerPoint |
| `DocPdfColor` | `#E02B20` | Thẻ file PDF | Nhận diện tài liệu PDF |
| `DocHwpColor` | `#0096D6` | Thẻ file HWP (Hangul) | Nhận diện tài liệu Hancom |
| `DocTxtColor` | `#4A5568` | Thẻ file TXT / Code / Log | Nhận diện file văn bản thô |

---

## 2. Thông Số Typography & Spacing (Layout Metrics)

| Quy Cách | Giá Trị | Áp Dụng Cho |
|---|---|---|
| **Display Title** | 30sp / Bold / LineHeight 36sp | Tiêu đề Splash Screen, Banner Paywall VIP |
| **Section Header** | 20sp / SemiBold / LineHeight 26sp | Tiêu đề mục chính, TopBar tiêu đề |
| **Card Title** | 16sp / Medium / LineHeight 22sp | Tên tệp tin trong danh sách tài liệu |
| **Metadata Text** | 12sp / Regular / LineHeight 16sp | Dung lượng file, thời gian sửa đổi |
| **Corner Radius (Cards)** | `12.dp` / `14.dp` | Bo góc thẻ tài liệu và ô công cụ nhanh |
| **Corner Radius (Buttons)**| `24.dp` / `14.dp` | Bo góc nút bấm CTA và ô nhập liệu AI |
| **Card Elevation** | `2.dp` (Light Mode) | Tạo chiều sâu nhẹ nhàng, không đổ bóng gắt |

---

## 3. Quy Tắc Chuyển Đổi Layout Cũ (XML) Sang Compose Hiện Đại

| Thành Phần Cũ (XML View System) | Thành Phần Mới (Jetpack Compose Material 3) | Lợi Ích & Cải Tiến |
|---|---|---|
| `RecyclerView + DocumentAdapter` | `LazyColumn + items(documents) { DocumentCard(...) }` | Hiệu năng mượt mà hơn 40%, không giật lag |
| `BottomNavigationView` | `NavigationBar + NavigationBarItem` | Hiệu ứng chuyển động mượt mà, hỗ trợ Dark Mode tự nhiên |
| `FloatingActionButton (XML)` | `FloatingActionButton(containerColor = BrandPrimary)` | Nút AI Assistant phát sáng hiện đại |
| `CoordinatorLayout + CollapsingToolbar` | `Scaffold + LargeTopAppBar(scrollBehavior)` | Co giãn linh hoạt theo cử chỉ cuộn |
| `Custom Shimmer Effect XML` | `Modifier.background(shimmerBrush())` | Tải dữ liệu giả lập nhẹ nhàng, tiết kiệm bộ nhớ |
