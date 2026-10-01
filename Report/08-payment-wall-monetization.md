# 8. Báo Cáo Phân Tích Payment Wall & Mô Hình Kiếm Tiền (Monetization)

> **Mục đích:** Phân tích kịch bản bán gói sub (IAP), các biến thể Paywall A/B testing, luồng điều tiết hiển thị quảng cáo (Ads Waterfall) trích xuất từ mã nguồn gốc.

---

## 1. Kịch Bản & Các Biến Thể Paywall (A/B Testing Variants)

Ứng dụng gốc thiết kế rất nhiều biến thể màn hình bán hàng để tối ưu tỷ lệ chuyển đổi (Conversion Rate Optimization):

| Biến Thể Paywall | Tên Class Gốc | Kịch Bản & Trải Nghiệm Người Dùng | Vị Trí Hiển Thị (Trigger) |
|---|---|---|---|
| **Standard Paywall** | `PurchaseAppFragment` | Hiển thị 3 lựa chọn: Tuần (3 ngày trial), Tháng, Năm (Tiết kiệm 70%). Danh sách 4 quyền lợi VIP. | Bấm vào huy hiệu VIP ở Header hoặc Tab Settings. |
| **Sale Promotion Paywall** | `SalePromotionFragment` | Đồng hồ đếm ngược Flash Sale (24h), giảm giá 50% cho gói Năm, làm mờ nền ứng dụng. | Sau khi mở thành công 3 tài liệu liên tiếp. |
| **Super Sale Paywall** | `SuperSaleFragment` | Giảm giá sốc 70%, chỉ hiển thị duy nhất 1 nút CTA lớn mua gói Năm. | Khi người dùng chuẩn bị xuất file PDF hoặc dùng AI lần thứ 2. |
| **Vertical Paywall** | `VerticalPurchaseFragment` | Giao diện cuộn dọc toàn màn hình với video demo tính năng chạy nền. | Khi khởi động app lần đầu sau onboarding (First Open). |
| **Remarketing Paywall** | `SaleRemarketingFragment` | "Cơ hội cuối cùng trước khi rời đi" - Ưu đãi giảm thêm 20% cho gói Tuần. | Khi người dùng nhấn nút Back để thoát app (`ExitActivity`). |

---

## 2. Bản Đồ Vị Trí Đặt Quảng Cáo (Ads Placement Map)

Hệ thống quảng cáo gốc được điều khiển thông qua `ikame SDK` kết hợp `AppLovin MAX` và `Firebase RemoteConfig`:

| Định Dạng Quảng Cáo | Vị Trí & Thời Điểm Hiển Thị | Tần Suất (Dear Rules Config) | Rủi Ro & Khắc Phục Mới |
|---|---|---|---|
| **App Open Ad** | Khi mở app từ trạng thái Background / Cold Start | 1 lần mỗi 4 tiếng | Đã thêm điều kiện kiểm tra trạng thái VIP để không làm phiền user trả phí. |
| **Native Ad** | Chèn xen kẽ vào danh sách tài liệu (`DocumentFragment`) | Cứ mỗi 5 item tài liệu thì chèn 1 card ad | Thiết kế khung thẻ đồng nhất với `DocumentCard` để giữ thẩm mỹ. |
| **Interstitial Ad** | Sau khi người dùng đóng tài liệu (`onBackPressed` từ Editor) | Tối đa 2 lần / 24h đối với hành vi đọc file (`read_file`) | Thêm cơ chế đệm thời gian tối thiểu 60s giữa 2 lần hiển thị. |
| **Banner Ad** | Cố định dưới chân màn hình Document Viewer | Hiển thị liên tục (tự động refresh 30s) | Tự động ẩn hoàn toàn khi bật chế độ đọc toàn màn hình hoặc Night Mode. |
| **Rewarded Ad** | Mở khóa tính năng AI tóm tắt hoặc chuyển đổi file HWP nâng cao | Người dùng tự nguyện xem để nhận 1 lượt AI miễn phí | Trải nghiệm thân thiện, tăng thời gian tương tác. |

---

## 3. Danh Sách File Liên Quan Đến Ads & Keys (Từ Decompiled APK)

- `out/apktool/res/xml/ik_sdk_config.xml`: Chứa toàn bộ chuỗi mã hóa cấu hình Ad IDs.
- `assets/ik_sdk_tracking_config.json`: Cấu hình sliding window 24h/168h cho các sự kiện quảng cáo.
- `lib/arm64-v8a/libnativelib.so`: Nơi lưu trữ khóa giải mã AES native (`SDKDataHolder.FFun`).
- `smali_classes8/com/happydev/wordoffice/utility/FirebaseConfig.smali`: Quản lý nhận script ads từ xa.
