# 6. Phụ Lục — Dữ Liệu Bằng Chứng & Khóa Decompile

> **Mục đích:** Lưu trữ bằng chứng xác thực từ file smali, danh sách URL và các khóa thu thập được.

---

## 6.1 Khóa & Định Danh Thu Thập Được Từ Tài Nguyên Gốc

| Khóa / Tên | Giá Trị Tìm Thấy | Vị Trí / Bằng Chứng |
|---|---|---|
| **Google API Key** | `AIzaSyC9l02Oqbt3JolJBwic0rt7rReZ5fZIBNg` | `res/values/strings.xml` |
| **Google App ID** | `1:732512160382:android:e0ac0f413c7257deb2262f` | `res/values/strings.xml` |
| **GCM Sender ID** | `732512160382` | `res/values/strings.xml` |
| **AdMob App ID** | `ca-app-pub-7680355516803423~4086483031` | `AndroidManifest.xml` |
| **OAuth Client Web ID**| `732512160382-qr7t8ldamp8ujsqgh33l246sunf6ags2.apps.googleusercontent.com` | `res/values/strings.xml` |
| **Crashlytics Mapping ID**| `a1a9f2dba2784376849c6314b01ba70f` | `res/values/strings.xml` |

---

## 6.2 Bằng Chứng Mã Nguồn (Smali Traces)

1. **FTP Service (Port 8982, anonymous):**
   - File: `smali_classes8/com/happydev/wordoffice/service/ftp/FtpService.smali`
2. **Upload tài liệu convert:**
   - File: `smali_classes8/com/happydev/wordoffice/repository/HwpConversionRepository.smali`
3. **Chucker Interceptor không có guard:**
   - File: `smali_classes7/com/ikameglobal/core/network/di/NetworkModule.smali`
4. **S2S Event Reporter:**
   - File: `smali_classes7/com/ikame/sdk/ik_sdk/e/e.smali`
