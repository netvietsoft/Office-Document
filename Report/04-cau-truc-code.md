# 4. Cấu Trúc Mã Nguồn & Sơ Đồ Kiến Trúc

> **Mục đích:** Mô tả chi tiết cấu trúc thư mục code của cả phiên bản decompile gốc và phiên bản tái dựng mới theo tiêu chuẩn Clean Architecture.

---

## 4.1 Cấu Trúc Mã Nguồn Tái Dựng Mới (Clean Architecture)

```
com.nextaitechnology.officedocument
│
├── OfficeApp.kt                               # Application Class + Container DI Hilt
│
├── core/                                      # Tầng Cốt Lõi (Dùng Chung Toàn App)
│   ├── designsystem/                          # Design System Tokens, Theme, Colors, Typography
│   │   ├── theme/                             # Theme.kt, Color.kt, Type.kt
│   │   └── component/                         # AppTopBar.kt, DocumentCard.kt
│   ├── model/                                 # Domain Models (DocumentFile, DocType, ConversionJob)
│   ├── database/                              # Room Database + SQLCipher (AppDatabase, DocumentDao)
│   ├── network/                               # Retrofit, Ktor, OkHttp với Certificate Pinning
│   ├── security/                              # EncryptedSharedPreferences, SafeStorageManager
│   └── engine/                                # Document Engine Abstraction (Word, Excel, PPT, PDF, HWP, TXT)
│
├── feature/                                   # Tầng Tính Năng Nghiệp Vụ (MVI / Compose)
│   ├── main/                                  # MainActivity, MainScreen (Home, Recent, Tools, Settings)
│   ├── viewer/                                # DocumentViewerScreen (Đọc đa định dạng, Night mode)
│   ├── editor/                                # Document Editor Toolbar & Revision
│   ├── pdf_tools/                             # PdfToolsScreen (Merge, Split, Sign, Watermark)
│   ├── scanner/                               # ScannerScreen (CameraX Scanner + ML Kit OCR)
│   ├── ai_assistant/                          # AiAssistantScreen (Trợ lý AI tóm tắt, sửa chính tả)
│   ├── transfer/                              # TransferScreen, SecureTransferService (Chia sẻ Wi-Fi bảo mật)
│   ├── cloud/                                 # Google Drive & OneDrive Picker
│   └── premium/                               # PremiumPaywallScreen (Gói VIP Pro, Paywall A/B testing)
│
└── di/                                        # Dagger Hilt Dependency Injection Modules
```
