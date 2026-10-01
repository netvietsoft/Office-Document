with open('PROJECT_MEMORY.md', 'a', encoding='utf-8') as f:
    f.write('''
---

## 23. Kiến Trúc Nhập Tệp Tin Cục Bộ (Local Document SAF Import Architecture) & Quản Trị Tệp Bền Vững Trên Màn Hình Home

- **Bối cảnh & Chỉ đạo từ Chủ Tịch:**
  "Check lại màn hình home ngoài scan còn phải import đc file từ local của điện thoại lên"
- **Kiến trúc & Triển khai Kỹ thuật:**
  1. **Storage Access Framework (SAF) Multi-Document Picker:**
     - Tích hợp `ActivityResultContracts.OpenMultipleDocuments()` tại `MainScreen.kt`, mở rộng phạm vi chọn tệp sang toàn bộ các định dạng văn phòng chuẩn (`*/*`).
     - Tự động trích xuất metadata tệp thông qua `ContentResolver` và `OpenableColumns`:
       * `OpenableColumns.DISPLAY_NAME`: Tên tệp gốc từ hệ điều hành.
       * `OpenableColumns.SIZE`: Dung lượng byte chính xác.
     - Phân loại định dạng dựa trên phần mở rộng file (`.doc`, `.docx` -> `DocType.WORD`; `.xls`, `.xlsx` -> `DocType.EXCEL`; `.ppt`, `.pptx` -> `DocType.PPT`; `.pdf` -> `DocType.PDF`; `.txt` -> `DocType.TXT`; `.hwp` -> `DocType.HWP`).
  2. **Cách Ly Vùng Nhớ Cache (Cache Isolation & Storage Sandbox):**
     - Mọi tệp URI được người dùng chọn từ SAF đều được sao chép nguyên trạng sang thư mục cache cục bộ của ứng dụng (`context.cacheDir/imported_docs/`) thông qua `LocalFileManager.copyUriToLocalCache(context, uri)`.
     - Lợi ích kiến trúc:
       * Loại bỏ lỗi mất quyền URI (`SecurityException: Permission Denial`) khi khởi động lại ứng dụng.
       * Cho phép `DocumentViewerScreen` truy cập file trực tiếp qua đường dẫn vật lý `file.absolutePath` mà không phụ thuộc vào trạng thái cấp quyền tạm thời của SAF.
  3. **Đếm Số Trang Vật Lý PDF Bằng Native Engine (`DocumentEngine.kt`):**
     - Nâng cấp `DocumentEngine.kt` với hàm `getRealPdfPageCount(file: File): Int`.
     - Sử dụng `ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY)` và `android.graphics.pdf.PdfRenderer` thuần JVM (không phụ thuộc file C++ `.so`, tương thích 100% 16 KB page size).
     - Trích xuất chính xác số trang thực tế của tệp PDF (`renderer.pageCount`) để hiển thị trên thẻ tài liệu và màn hình đọc.
  4. **Lưu Trữ Trạng Thái Bền Vững (Persistence) Qua SharedPreferences:**
     - Danh sách tệp nhập khẩu được mã hóa và lưu tại SharedPreferences key `office_doc_imported_files` (`getImportedDocs` & `saveImportedDocs`).
     - Khởi động ứng dụng: Hợp nhất `imported_docs` với `sampleDocs` (loại trừ các tệp nằm trong danh sách đen `office_doc_deleted_ids`).
     - Khi xóa tệp: Đồng bộ xóa khỏi `imported_docs` và lưu lại vào SharedPreferences, đảm bảo tệp nhập khẩu bị xóa vĩnh viễn và không bị tái sinh khi mở lại ứng dụng.
  5. **Giao Diện Đa Điểm Chạm (Multi-Touchpoints Material 3 UI):**
     - **Floating Action Button (+):** Bấm mở `AddDocumentBottomSheet` với 3 thẻ tùy chọn trực quan ("Nhập Tệp Từ Máy", "Quét Tài Liệu OCR", "Bộ Công Cụ PDF Suite").
     - **Tiêu đề Danh Mục Tài Liệu:** Thêm nút `[Import / Nhập tệp]` (`FilledTonalButton` + icon `FolderOpen`) cho phép nhập tệp 1 chạm trực tiếp.
     - **Empty Folder State:** Thêm nút `[Nhập Tệp Từ Máy]` bên cạnh nút `[Quét OCR]`.
     - Trải nghiệm tự động: Nếu người dùng chọn đúng 1 tệp, ứng dụng tự động mở ngay màn hình đọc tài liệu (`onOpenDocument`).
  6. **Bằng chứng nghiệm thu thực tế trên máy thật Samsung Galaxy A50s:**
     - Nút Import trên Home: [`screen_home_import_verified2.png`](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/scripts/screen_home_import_verified2.png)
     - Modal Bottom Sheet từ FAB: [`screen_fab_sheet_verified.png`](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/scripts/screen_fab_sheet_verified.png)
     - Mở trình duyệt tệp SAF DocumentsUI: [`screen_saf_from_sheet_verified.png`](file:///f:/APP/Ikame/Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure/scripts/screen_saf_from_sheet_verified.png)
''')
print("Successfully appended Section 23")
