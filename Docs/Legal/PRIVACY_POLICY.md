# Privacy Policy - Office Document: Word, PDF, XLSX

**Last Updated:** September 17, 2026

---

### Application & Developer Identification:
• **Application Name:** Office Document: Word, PDF, XLSX  
• **Package ID:** `com.officedocument.word.docx.xlsx.viewer`  
• **Developer Account:** Surgio Killa  
• **Developer / Owner Name:** Phạm Thị Phương Thảo (Pham Thi Phuong Thao)  
• **Developer Support Email:** ms13killla@gmail.com  
• **Developer Address:** Đông Các, Đông Hưng, Thái Bình, 410000, Vietnam  
• **Official Privacy Policy URL:** [https://netvietgroups.com/privacy-and-policy-office-document/](https://netvietgroups.com/privacy-and-policy-office-document/)  

---

### 1. Introduction
Welcome to **Office Document: Word, PDF, XLSX** ("the App"), developed and operated by **Surgio Killa** (owned by **Phạm Thị Phương Thảo**, "Developer", "we", "us", or "our"). We are dedicated to safeguarding the privacy and personal data of every user ("User" or "you") who installs and uses our application. 

This Privacy Policy explains in detail our data practices, what device permissions are requested, how information is handled, and your rights in strict compliance with the **Google Play Developer Program Policies**, the **Google Play User Data Policy**, and international privacy standards.

---

### 2. Information We Do NOT Collect
Office Document: Word, PDF, XLSX is designed with a **privacy-first, on-device architecture**. We respect the confidentiality of your documents and personal life:

• **No Document Content Collection or Cloud Inspection:** We do **NOT** upload, read, collect, monitor, or store the contents of your documents, spreadsheets, presentations, or text files (including DOCX, DOC, XLSX, XLS, PPTX, PPT, PDF, TXT, HWP, EPUB). All file opening, parsing, reading, rendering, and offline editing are performed **strictly locally on your device**.  
• **No Personal Identity Data:** We do **NOT** collect personally identifiable information such as your full legal name, national identity number, passport number, personal phone number, contacts list, or physical home address.  
• **No Private Media Snooping:** We do **NOT** inspect, duplicate, or transmit your private photos, home videos, audio recordings, or non-document files to external cloud servers.  
• **No Financial or Payment Credentials:** We do **NOT** collect or store credit card numbers, bank account numbers, or billing addresses. All subscription transactions are processed directly and securely by Google Play In-App Billing.  
• **No GPS Location Tracking:** We do **NOT** request or track your device's precise GPS physical location.  

---

### 3. Device Permissions & Purpose of Use
To provide essential document reading, document scanning, PDF conversion, and file management functions, the App requests specific device permissions. Each permission is requested strictly within the bounds of its operational purpose:

#### 3.1 Camera & Scanning
• `android.permission.CAMERA`  
*Purpose:* Used specifically for the **Document Scanner (OCR)** feature. It allows you to take pictures of physical paper documents, receipts, invoices, book pages, or business cards to convert them into digital PDF files or extract editable text using Optical Character Recognition (OCR).  
*Data Protection:* Camera capture operates on-demand only when you open the Scanner. Image data is processed locally on your device and is never sent to remote servers without your explicit intent.

#### 3.2 Storage & Media Access
• `android.permission.READ_MEDIA_IMAGES` (Android 13+ / API Level 33+)  
*Purpose:* Allows you to select photos or scans from your gallery when using the **Image to PDF** conversion feature or OCR extraction.  
• `android.permission.READ_EXTERNAL_STORAGE` & `android.permission.WRITE_EXTERNAL_STORAGE` (Android 12 and below / API Level ≤ 32)  
*Purpose:* Required on older Android operating systems to discover, open, display, edit, and save document files stored in your device storage or SD card.  
• `android.permission.MANAGE_EXTERNAL_STORAGE` (All Files Access - where applicable)  
*Purpose:* Enables the all-in-one document viewer and manager to index, categorize, browse, rename, delete, and organize all document formats (Word, Excel, PowerPoint, PDF, HWP, TXT) across device directories as requested by the user.  
*Data Protection:* Storage access is used exclusively to facilitate file viewing and document management. No personal files are transferred outside your device.

#### 3.3 Network & Connectivity
• `android.permission.INTERNET`, `android.permission.ACCESS_NETWORK_STATE`, `android.permission.ACCESS_WIFI_STATE`  
*Purpose:*  
1. Verifies internet connectivity to download non-intrusive advertisements via Google AdMob.  
2. Verifies purchase tokens and subscription status with Google Play In-App Billing.  
3. Reports anonymous crash and performance telemetry via Firebase Crashlytics & Analytics.  
4. Connects to secure document conversion cloud services when you explicitly initiate complex cloud-assisted file conversions.

#### 3.4 Google Play In-App Billing
• `com.android.vending.BILLING`  
*Purpose:* Enables secure processing of VIP subscriptions and Premium upgrades (ad removal, unlimited PDF tools) through Google Play Billing (Play Billing Library 8.0.0).  
*Data Protection:* Financial transactions are executed directly within the Google Play secure interface. The developer never receives, processes, or stores your financial or credit card information.

#### 3.5 Advertising Identifier
• `com.google.android.gms.permission.AD_ID`  
*Purpose:* Used by Google Mobile Ads (AdMob) to display appropriate ads, control advertisement frequency (capping), and respect user opt-out preferences for personalized ads in compliance with Google Play Developer Policy.

#### 3.6 Foreground Service & Task Execution
• `android.permission.FOREGROUND_SERVICE`  
*Purpose:* Maintains background execution for long-running document operations (such as converting large multi-page PDFs, high-resolution document processing, or local file synchronization) to prevent Android from killing the task prematurely.  
*User Awareness:* A persistent notification is shown in your status bar while the foreground task is active.

#### 3.7 Notifications
• `android.permission.POST_NOTIFICATIONS` (Android 13+ / API Level 33+)  
*Purpose:* Sends local notifications to alert you when a long-running document conversion or export task has finished, or to inform you of essential application updates. You can enable or disable notifications at any time in system settings.

#### 3.8 User Experience & Convenience
• `android.permission.WAKE_LOCK`: Keeps the screen illuminated while reading long documents, books, or presentations in Reading Mode so the display does not unexpectedly turn off.  
• `android.permission.VIBRATE`: Provides subtle haptic feedback for user interactions, button clicks, and page flipping.  
• `com.android.launcher.permission.INSTALL_SHORTCUT`: Allows you to pin shortcuts of your favorite documents directly onto your home screen for one-tap access.

---

### 4. Third-Party Services & SDK Integrations
To maintain high app stability, troubleshoot crashes, and provide monetization to support free app access, we integrate trusted third-party SDKs that comply with Google Play policies:

• **Google Play Services:** Core platform features and security.  
  *Privacy Policy:* [https://policies.google.com/privacy](https://policies.google.com/privacy)  
• **Google AdMob:** Delivers banner, interstitial, and native advertisements.  
  *Privacy Policy:* [https://policies.google.com/technologies/ads](https://policies.google.com/technologies/ads)  
• **Google Firebase Analytics & Crashlytics:** Anonymous crash reporting, performance logs, and feature usage statistics to help us fix bugs and improve stability.  
  *Privacy Policy:* [https://firebase.google.com/support/privacy](https://firebase.google.com/support/privacy)  
• **Google Play In-App Billing:** Manages secure in-app purchases and VIP subscriptions.  
  *Terms & Privacy:* [https://play.google.com/about/monetization-ads/](https://play.google.com/about/monetization-ads/)  
• **Google ML Kit:** On-device machine learning library used for Optical Character Recognition (OCR) text recognition. All text recognition is processed locally on-device.  
  *ML Kit Terms:* [https://developers.google.com/ml-kit/terms](https://developers.google.com/ml-kit/terms)

---

### 5. In-App Purchases, Subscriptions & Cancellation Policy
The App offers optional VIP / Premium subscription memberships (Weekly, Monthly, Yearly) and one-time purchases (Lifetime VIP) providing an ad-free experience, unlimited PDF tools, and unrestricted OCR document scanning.

#### 5.1 Purchase & Billing Terms (Điều Khoản Mua Gói VIP)
• **Payment Authorization:** Payment is charged directly to your **Google Play Account** immediately upon purchase confirmation.  
• **Transparent Pricing:** All prices are clearly displayed in your local currency as determined by your Google Play regional store prior to payment confirmation, in full compliance with the Google Play Subscriptions Policy. There are no hidden fees or undisclosed recurring costs.  
• **VIP Entitlements:** Activating a VIP subscription unlocks:
  - 100% Ad-Free Experience (Removes all App Open, Interstitial, Banner, and Native ads).
  - Unlimited Document Conversions (PDF to Word, Excel, PowerPoint, Image to PDF).
  - Unlimited OCR Text Recognition & Scanner processing.
  - High-speed cloud conversion and file optimization.

#### 5.2 Free Trial Terms (Điều Khoản Dùng Thử Miễn Phí)
• Certain promotional subscription plans may include a **3-Day Free Trial**.  
• If a free trial is offered, you will enjoy full VIP access for the duration of the trial period without charge.  
• **Conversion to Paid Subscription:** To prevent charges, you must cancel the trial at least **24 hours before the 3-day trial period expires**. If not canceled, your Google Play Account will be automatically charged the regular subscription fee for the selected plan.  
• Any unused portion of a free trial will be forfeited if you purchase a subscription prior to trial expiration.

#### 5.3 Auto-Renewal Terms (Điều Khoản Tự Động Gia Hạn)
• Subscriptions automatically renew at the end of each billing cycle (weekly, monthly, or yearly) unless auto-renew is canceled by the user at least **24 hours before the end of the current billing period**.  
• Your Google Play Account will be charged for renewal within **24 hours prior to the end of the current period** at the agreed subscription rate.  
• In the event of any price changes, Google Play will notify you in advance, and your explicit consent will be required before you are billed at the new price.

#### 5.4 How to Cancel Your Subscription (Hướng Dẫn Hủy Gói Thuê Bao Chi Tiết)
You can cancel your subscription or trial at any time. **Please note: Simply uninstalling or deleting the App does NOT cancel your subscription or stop recurring charges.** You must cancel through Google Play:

**Method 1: Direct Link**  
Visit your Google Play Subscriptions page: [https://play.google.com/store/account/subscriptions](https://play.google.com/store/account/subscriptions)

**Method 2: Step-by-Step on Android Device**  
1. Open the **Google Play Store** app on your Android smartphone or tablet.  
2. Tap your **Profile icon** in the top-right corner.  
3. Tap **Payments & subscriptions** > **Subscriptions**.  
4. Select **Office Document: Word, PDF, XLSX**.  
5. Tap **Cancel subscription** and follow the on-screen prompts to confirm.

**What Happens After Cancellation?**  
• Once canceled, you will continue to have full access to all VIP features until the end of your current paid billing period.  
• No further automatic renewal charges will occur after the expiration date.

#### 5.5 Refund Policy (Chính Sách Hoàn Tiền)
• All financial transactions and subscription charges are governed directly by **Google Play's Refund Policies**.  
• **Requesting a Refund:** If you made an accidental purchase or wish to request a refund, you can submit a refund request directly through Google Play within **48 hours** of purchase by visiting: [https://support.google.com/googleplay/answer/2479637](https://support.google.com/googleplay/answer/2479637) or via your Google Play Order History.  
• As a third-party developer, we do not have direct access to your credit card or Google Play wallet and cannot process monetary refunds directly.

#### 5.6 Restore Purchases (Khôi Phục Gói Đã Mua)
If you switch devices or reinstall the App, you can restore your active VIP subscription at any time without paying again by tapping the **"Restore Purchases"** button on the in-app VIP Paywall screen while logged into the same Google Play account.

---

### 6. Children's Privacy (COPPA Compliance)
Office Document: Word, PDF, XLSX is a general productivity tool and is **not directed at children under the age of 13** (or under 16 in certain jurisdictions). We do not knowingly collect or solicit personal information from children. If we discover that a child under 13 has provided us with personal information, we will delete it promptly. If you believe your child has provided us with information, please contact us immediately at **ms13killla@gmail.com**.

---

### 7. User Control & Data Deletion Rights
You have complete control over your data and device permissions:

• **Managing Permissions:** You can grant or revoke any permission (Camera, Media/Storage, Notifications) at any time via:  
  `Device Settings > Apps > Office Document > Permissions`.  
• **Advertising Identifier Control:** You can reset or delete your Google Advertising ID at any time via:  
  `Device Settings > Google > Ads > Reset advertising ID / Delete advertising ID`.  
• **Data Inquiries & Deletion:** Since we do not host user accounts or cloud document storage, we do not retain your personal documents. If you have any inquiries regarding technical crash logs or wish to request data deletion, please email us at **ms13killla@gmail.com**. Requests are handled within 30 business days.

---

### 8. Security of Your Data
We prioritize the security of your information. All local data stays within your device's protected application sandbox. Any external communication (such as crash diagnostics or ad requests) occurs strictly via encrypted **HTTPS / TLS 1.3** connections. Cleartext HTTP traffic is completely blocked.

---

### 9. Changes to This Privacy Policy
We may periodically update this Privacy Policy to reflect changes in our app features, operational practices, or legal and regulatory obligations. Any revisions will be published with an updated "Last Updated" date at the top of this document. We encourage you to review this Privacy Policy periodically.

---

### 10. Contact Information
If you have any questions, concerns, or feedback regarding this Privacy Policy or our privacy practices, please contact us:

• **Developer Account:** Surgio Killa  
• **Developer / Owner Name:** Phạm Thị Phương Thảo (Pham Thi Phuong Thao)  
• **Application Name:** Office Document: Word, PDF, XLSX  
• **Application Package ID:** `com.officedocument.word.docx.xlsx.viewer`  
• **Support Email:** ms13killla@gmail.com  
• **Physical Address:** Đông Các, Đông Hưng, Thái Bình, 410000, Vietnam  
