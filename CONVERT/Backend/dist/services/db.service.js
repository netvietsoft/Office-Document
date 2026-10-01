"use strict";
/**
 * Database Service / Dịch Vụ Cơ Sở Dữ Liệu
 * Central In-Memory & Persistent Storage Engine for NextAI Office Backend (Port 1500).
 * Cung cấp đầy đủ các thao tác CRUD và thống kê phân tích:
 * 1. Quản lý API Key (Gemini, Grok xAI, OpenAI)
 * 2. Quản lý Thiết bị & User (Mã thiết bị Device ID, Giới hạn dùng thử 1 lần duy nhất, Trạng thái VIP, Hủy gói)
 * 3. Quản lý Doanh thu (Theo Ngày, Tuần, Tháng, Năm, Khoảng thời gian X -> Y)
 * 4. Quản lý Media Cloudflare R2 & Tiến trình chuyển đổi
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const config_1 = require("../config");
class DatabaseService {
    // 1. API Keys Storage (Gemini & Grok)
    apiKeys = [
        {
            id: 'key-gemini-01',
            provider: 'gemini',
            keyName: 'Gemini 1.5 Flash Primary Gateway',
            apiKey: 'AIzaSyB_NextAI_Gemini_Production_Live_Key_2026',
            model: 'gemini-1.5-flash',
            status: 'active',
            quotaTotal: 1000000,
            quotaUsed: 14205,
            createdAt: '2026-01-10 10:00:00',
            lastUsedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            note: 'Dùng cho AI Assistant tóm tắt tài liệu và dịch thuật thời gian thực',
        },
        {
            id: 'key-gemini-02',
            provider: 'gemini',
            keyName: 'Gemini 1.5 Pro High-Precision Reasoning',
            apiKey: 'AIzaSyA_NextAI_Gemini_Pro_Analysis_Key_2026',
            model: 'gemini-1.5-pro',
            status: 'active',
            quotaTotal: 500000,
            quotaUsed: 3840,
            createdAt: '2026-02-01 12:00:00',
            lastUsedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            note: 'Dùng cho phân tích hợp đồng phức tạp và trích xuất bảng tính Excel',
        },
        {
            id: 'key-grok-01',
            provider: 'grok',
            keyName: 'Grok-2 xAI Ultra-Fast Neural Engine',
            apiKey: 'xai-grok-NextAI-Production-Live-Key-2026-v2',
            model: 'grok-2',
            status: 'active',
            quotaTotal: 800000,
            quotaUsed: 9230,
            createdAt: '2026-02-15 08:30:00',
            lastUsedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            note: 'Dùng cho Trợ lý trả lời câu hỏi trực tiếp và xử lý văn phong sắc sảo',
        },
        {
            id: 'key-openai-01',
            provider: 'openai',
            keyName: 'OpenAI GPT-4o Mini Fallback Gateway',
            apiKey: 'sk-proj-NextAI-OpenAI-Backup-Key-2026-v4',
            model: 'gpt-4o-mini',
            status: 'active',
            quotaTotal: 500000,
            quotaUsed: 1250,
            createdAt: '2026-03-01 09:00:00',
            lastUsedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            note: 'Cổng dự phòng khẩn cấp khi Google hoặc xAI bị nghẽn mạng',
        },
    ];
    // 2. Users Storage
    users = [
        {
            id: 'usr-001',
            email: 'admin@nextaitechnology.com',
            fullName: 'NextAI SuperAdmin',
            role: 'admin',
            isVip: true,
            status: 'active',
            createdAt: '2026-01-01 08:00:00',
        },
        {
            id: 'usr-002',
            email: 'manager@nextaitechnology.com',
            fullName: 'Office Operations Manager',
            role: 'manager',
            isVip: true,
            status: 'active',
            createdAt: '2026-01-05 09:30:00',
        },
        {
            id: 'usr-003',
            email: 'alex.morgan@gmail.com',
            fullName: 'Alex Morgan',
            role: 'user',
            isVip: true,
            status: 'active',
            createdAt: '2026-01-15 14:20:00',
        },
        {
            id: 'usr-004',
            email: 'david.beck@outlook.com',
            fullName: 'David Beck',
            role: 'user',
            isVip: false,
            status: 'active',
            createdAt: '2026-02-10 11:15:00',
        },
    ];
    // 3. Devices Storage (Mã thiết bị Device ID & Kiểm soát Dùng thử 1 lần)
    devices = [
        {
            deviceId: 'dev_072346080be86198',
            userId: 'usr-001',
            adId: '38400000-8cf0-11bd-b23e-10b96e400000',
            platform: 'android',
            osVersion: 'Android (Samsung Galaxy A07)',
            appVersion: '2.1.16',
            country: 'VN',
            installedAt: '2026-10-01 09:10:49',
            lastActiveAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: 'vip',
            vipPlan: 'pro_yearly',
            vipExpiresAt: '2027-10-01 23:59:59',
            aiTrialUsed: true,
            aiTrialUsedAt: '2026-10-01 09:10:49',
            aiUsageCount: 15,
        },
        {
            deviceId: 'dev-samsung-chairman-test-1790845744583',
            userId: 'usr-001',
            platform: 'android',
            osVersion: 'Android',
            appVersion: '2.1.16',
            country: 'VN',
            installedAt: '2026-10-01 09:09:04',
            lastActiveAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: 'vip',
            vipPlan: 'pro_yearly',
            vipExpiresAt: '2027-10-01 23:59:59',
            aiTrialUsed: true,
            aiTrialUsedAt: '2026-10-01 09:09:04',
            aiUsageCount: 5,
        },
        {
            deviceId: 'dev-samsung-a50s-chairman',
            userId: 'usr-001',
            adId: '38400000-8cf0-11bd-b23e-10b96e400000',
            platform: 'android',
            osVersion: 'Android 11 (API 30)',
            appVersion: '2.1.16',
            country: 'VN',
            installedAt: '2026-09-28 08:00:00',
            lastActiveAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: 'vip',
            vipPlan: 'pro_yearly',
            vipExpiresAt: '2027-09-28 23:59:59',
            aiTrialUsed: true,
            aiTrialUsedAt: '2026-09-28 08:05:00',
            aiUsageCount: 89,
        },
        {
            deviceId: 'dev-pixel8-001',
            userId: 'usr-003',
            adId: '38400000-8cf0-11bd-b23e-10b96e400001',
            platform: 'android',
            osVersion: 'Android 15 (API 35)',
            appVersion: '2.1.16',
            country: 'US',
            installedAt: '2026-01-15 14:20:00',
            lastActiveAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: 'vip',
            vipPlan: 'pro_monthly',
            vipExpiresAt: '2026-10-15 23:59:59',
            aiTrialUsed: true,
            aiTrialUsedAt: '2026-01-15 14:22:00',
            aiUsageCount: 45,
        },
        {
            deviceId: 'dev-s24ultra-002',
            adId: '38400000-8cf0-11bd-b23e-10b96e400002',
            platform: 'android',
            osVersion: 'Android 14 (API 34)',
            appVersion: '2.1.15',
            country: 'SG',
            installedAt: '2026-02-20 11:00:00',
            lastActiveAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: 'cancelled',
            vipPlan: 'pro_weekly',
            vipExpiresAt: '2026-02-27 23:59:59',
            cancelledAt: '2026-02-26 18:30:00',
            aiTrialUsed: true,
            aiTrialUsedAt: '2026-02-20 11:05:00',
            aiUsageCount: 12,
        },
        {
            deviceId: 'dev-xiaomi-14-003',
            adId: '38400000-8cf0-11bd-b23e-10b96e400003',
            platform: 'android',
            osVersion: 'Android 14 (HyperOS)',
            appVersion: '2.1.16',
            country: 'VN',
            installedAt: '2026-09-30 19:40:00',
            lastActiveAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: 'free',
            vipPlan: 'free',
            aiTrialUsed: true, // Đã dùng 1 lần demo -> bị khóa, bắt buộc mua gói
            aiTrialUsedAt: '2026-09-30 19:45:00',
            aiUsageCount: 1,
        },
        {
            deviceId: 'dev-oppo-reno11-004',
            adId: '38400000-8cf0-11bd-b23e-10b96e400004',
            platform: 'android',
            osVersion: 'Android 14 (ColorOS)',
            appVersion: '2.1.16',
            country: 'TH',
            installedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            lastActiveAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: 'free',
            vipPlan: 'free',
            aiTrialUsed: false, // Thiết bị mới tinh, còn 1 lần dùng thử miễn phí
            aiUsageCount: 0,
        },
    ];
    // 4. Revenue Transactions Storage (Nhật ký giao dịch Google Play)
    revenueRecords = [
        {
            id: 'rev-001',
            orderId: 'GPA.3312-4451-9982-10001',
            deviceId: 'dev-samsung-a50s-chairman',
            userId: 'usr-001',
            userEmail: 'chairman@nextaitechnology.com',
            planType: 'pro_yearly',
            amountUsd: 39.99,
            amountVnd: 1050000,
            currency: 'VND',
            status: 'COMPLETED',
            paymentMethod: 'Google Play Billing',
            timestamp: '2026-09-28 08:10:00',
        },
        {
            id: 'rev-002',
            orderId: 'GPA.3312-4451-9982-10002',
            deviceId: 'dev-pixel8-001',
            userId: 'usr-003',
            userEmail: 'alex.morgan@gmail.com',
            planType: 'pro_monthly',
            amountUsd: 14.99,
            amountVnd: 390000,
            currency: 'USD',
            status: 'COMPLETED',
            paymentMethod: 'Google Play Billing',
            timestamp: '2026-09-29 14:20:00',
        },
        {
            id: 'rev-003',
            orderId: 'GPA.3312-4451-9982-10003',
            deviceId: 'dev-s24ultra-002',
            userEmail: 'singapore.user@gmail.com',
            planType: 'pro_weekly',
            amountUsd: 4.99,
            amountVnd: 130000,
            currency: 'SGD',
            status: 'COMPLETED',
            paymentMethod: 'Google Play Billing',
            timestamp: '2026-09-29 18:45:00',
        },
        {
            id: 'rev-004',
            orderId: 'GPA.3312-4451-9982-10004',
            deviceId: 'dev-japan-docomo-005',
            userEmail: 'yamada.kenji@yahoo.co.jp',
            planType: 'pro_yearly',
            amountUsd: 39.99,
            amountVnd: 1050000,
            currency: 'JPY',
            status: 'COMPLETED',
            paymentMethod: 'Google Play Billing',
            timestamp: '2026-09-30 09:15:00',
        },
        {
            id: 'rev-005',
            orderId: 'GPA.3312-4451-9982-10005',
            deviceId: 'dev-germany-samsung-006',
            userEmail: 'hans.mueller@web.de',
            planType: 'pro_monthly',
            amountUsd: 14.99,
            amountVnd: 390000,
            currency: 'EUR',
            status: 'COMPLETED',
            paymentMethod: 'Google Play Billing',
            timestamp: '2026-09-30 16:30:00',
        },
        {
            id: 'rev-006',
            orderId: 'GPA.3312-4451-9982-10006',
            deviceId: 'dev-vietnam-hanoi-007',
            userEmail: 'nguyenvanan.hanoi@gmail.com',
            planType: 'pro_yearly',
            amountUsd: 39.99,
            amountVnd: 1050000,
            currency: 'VND',
            status: 'COMPLETED',
            paymentMethod: 'Google Play Billing',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        },
    ];
    // 5. Media & Conversions
    mediaFiles = [
        {
            id: 'med-001',
            filename: 'word_to_pdf_tutorial.mp4',
            r2Key: 'tutorials/word_to_pdf_tutorial.mp4',
            r2Bucket: 'nextai-office-media',
            contentType: 'video/mp4',
            sizeBytes: 12450000,
            publicUrl: 'https://media.nextaitechnology.com/tutorials/word_to_pdf_tutorial.mp4',
            uploadedBy: 'usr-001',
            createdAt: '2026-01-10 10:00:00',
            expiresAt: '2026-01-10 11:00:00',
        },
        {
            id: 'med-002',
            filename: 'banner_super_sale_70.webp',
            r2Key: 'banners/banner_super_sale_70.webp',
            r2Bucket: 'nextai-office-media',
            contentType: 'image/webp',
            sizeBytes: 142000,
            publicUrl: 'https://media.nextaitechnology.com/banners/banner_super_sale_70.webp',
            uploadedBy: 'usr-002',
            createdAt: '2026-02-01 08:30:00',
            expiresAt: '2026-02-01 09:30:00',
        },
    ];
    jobs = [
        {
            id: 'job-001',
            deviceId: 'dev-pixel8-001',
            sourceFilename: 'Annual_Report_2026.hwp',
            sourceFormat: 'hwp',
            targetFormat: 'docx',
            fileSizeBytes: 4521900,
            status: 'COMPLETED',
            downloadUrl: 'http://localhost:1500/api/v1/download/job-001/Annual_Report_2026.docx',
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
        },
    ];
    constructor() {
        this.syncKeysFromEnv();
    }
    /**
     * Đồng bộ khóa API từ biến môi trường .env vào bộ nhớ runtime
     * Sync API keys from .env into runtime storage
     */
    syncKeysFromEnv() {
        if (config_1.config.ai.geminiApiKey) {
            const gemini = this.apiKeys.find(k => k.id === 'key-gemini-01');
            if (gemini)
                gemini.apiKey = config_1.config.ai.geminiApiKey;
        }
        if (config_1.config.ai.grokApiKey) {
            const grok = this.apiKeys.find(k => k.id === 'key-grok-01');
            if (grok)
                grok.apiKey = config_1.config.ai.grokApiKey;
        }
        if (config_1.config.ai.openaiApiKey) {
            const openai = this.apiKeys.find(k => k.id === 'key-openai-01');
            if (openai)
                openai.apiKey = config_1.config.ai.openaiApiKey;
        }
    }
    // ==========================================
    // API KEY METHODS (Gemini, Grok xAI, OpenAI)
    // ==========================================
    getApiKeys() {
        return this.apiKeys;
    }
    getApiKeyById(id) {
        return this.apiKeys.find(k => k.id === id);
    }
    getActiveApiKey(provider) {
        return this.apiKeys.find(k => k.provider === provider && k.status === 'active');
    }
    addApiKey(data) {
        const newKey = {
            ...data,
            id: `key-${data.provider}-${(0, uuid_1.v4)().substring(0, 6)}`,
            quotaUsed: 0,
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
        this.apiKeys.unshift(newKey);
        return newKey;
    }
    updateApiKey(id, updates) {
        const key = this.getApiKeyById(id);
        if (!key)
            return null;
        Object.assign(key, updates);
        return key;
    }
    toggleApiKey(id) {
        const key = this.getApiKeyById(id);
        if (!key)
            return null;
        key.status = key.status === 'active' ? 'inactive' : 'active';
        return key;
    }
    deleteApiKey(id) {
        const index = this.apiKeys.findIndex(k => k.id === id);
        if (index === -1)
            return false;
        this.apiKeys.splice(index, 1);
        return true;
    }
    recordApiKeyUsage(id, tokensOrRequests = 1) {
        const key = this.getApiKeyById(id);
        if (key) {
            key.quotaUsed += tokensOrRequests;
            key.lastUsedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
            if (key.quotaUsed >= key.quotaTotal) {
                key.status = 'rate_limited';
            }
        }
    }
    // ==========================================
    // DEVICE & USER METHODS (Kiểm soát 1 lần dùng thử)
    // ==========================================
    getDevices(statusFilter) {
        if (!statusFilter || statusFilter === 'all')
            return this.devices;
        return this.devices.filter(d => d.status === statusFilter);
    }
    getDeviceById(deviceId) {
        return this.devices.find(d => d.deviceId === deviceId);
    }
    registerDevice(data) {
        let existing = this.getDeviceById(data.deviceId);
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
        if (existing) {
            existing.lastActiveAt = now;
            if (data.appVersion)
                existing.appVersion = data.appVersion;
            if (data.osVersion)
                existing.osVersion = data.osVersion;
            if (data.country)
                existing.country = data.country;
            if (data.fcmToken)
                existing.fcmToken = data.fcmToken;
            return existing;
        }
        const newDevice = {
            deviceId: data.deviceId,
            userId: data.userId,
            adId: data.adId,
            platform: data.platform || 'android',
            osVersion: data.osVersion || 'Android',
            appVersion: data.appVersion || '2.1.16',
            country: data.country || 'VN',
            installedAt: now,
            lastActiveAt: now,
            status: 'free',
            vipPlan: 'free',
            aiTrialUsed: false, // Thiết bị mới -> được dùng thử đúng 1 lần duy nhất
            aiUsageCount: 0,
            fcmToken: data.fcmToken,
        };
        this.devices.unshift(newDevice);
        return newDevice;
    }
    /**
     * Xác thực và tiêu thụ lượt dùng thử AI theo mã thiết bị (Device ID)
     * Yêu cầu: "chỉ đc sử dụng demo 1 lần, Các lần tiếp theo phải đăng ký Subcription"
     */
    verifyAndConsumeAiQuota(deviceId, feature = 'chat') {
        let device = this.getDeviceById(deviceId);
        if (!device) {
            device = this.registerDevice({ deviceId });
        }
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
        device.lastActiveAt = now;
        // Tự động bảo đảm quyền VIP cho thiết bị của Chủ Tịch
        const normalizedId = deviceId.toLowerCase();
        if (normalizedId === 'dev_072346080be86198' ||
            normalizedId.includes('chairman') ||
            normalizedId.includes('samsung-a07') ||
            normalizedId.includes('samsung-a50s')) {
            device.status = 'vip';
            device.vipPlan = 'pro_yearly';
            if (!device.vipExpiresAt) {
                const exp = new Date();
                exp.setFullYear(exp.getFullYear() + 2);
                device.vipExpiresAt = exp.toISOString().replace('T', ' ').substring(0, 19);
            }
        }
        // 1. Nếu là thiết bị VIP -> Cho phép không giới hạn
        if (device.status === 'vip' || (device.vipExpiresAt && new Date(device.vipExpiresAt) > new Date())) {
            device.aiUsageCount += 1;
            return {
                allowed: true,
                isVip: true,
                remainingTrials: 999999,
                message: `VIP Access Granted for feature: ${feature}`,
            };
        }
        // 2. Nếu chưa dùng thử -> Cấp quyền dùng 1 lần duy nhất và đánh dấu đã sử dụng
        if (!device.aiTrialUsed) {
            device.aiTrialUsed = true;
            device.aiTrialUsedAt = now;
            device.aiUsageCount = 1;
            return {
                allowed: true,
                isVip: false,
                remainingTrials: 0,
                message: `Free demo trial used (1/1). Next usage requires subscription.`,
            };
        }
        // 3. Đã dùng thử rồi -> Khóa truy cập, yêu cầu đăng ký VIP
        return {
            allowed: false,
            isVip: false,
            remainingTrials: 0,
            message: `Hạn ngạch dùng thử AI (1 lần) đã hết. Vui lòng nâng cấp gói VIP để tiếp tục sử dụng.`,
        };
    }
    toggleDeviceVip(deviceId, plan = 'pro_yearly') {
        const device = this.getDeviceById(deviceId);
        if (!device)
            return null;
        if (device.status === 'vip') {
            device.status = 'cancelled';
            device.cancelledAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
        }
        else {
            device.status = 'vip';
            device.vipPlan = plan;
            const expireDate = new Date();
            expireDate.setFullYear(expireDate.getFullYear() + 1);
            device.vipExpiresAt = expireDate.toISOString().replace('T', ' ').substring(0, 19);
            device.cancelledAt = undefined;
        }
        return device;
    }
    resetDeviceTrial(deviceId) {
        const device = this.getDeviceById(deviceId);
        if (!device)
            return null;
        device.aiTrialUsed = false;
        device.aiTrialUsedAt = undefined;
        device.aiUsageCount = 0;
        return device;
    }
    // ==========================================
    // REVENUE & ANALYTICS METHODS
    // (Theo Ngày, Tuần, Tháng, Năm, Khoảng X -> Y)
    // ==========================================
    addRevenueRecord(data) {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const newRecord = {
            ...data,
            id: `rev-${(0, uuid_1.v4)().substring(0, 8)}`,
            timestamp: now,
        };
        this.revenueRecords.unshift(newRecord);
        // Cập nhật thiết bị sang VIP
        const device = this.getDeviceById(data.deviceId);
        if (device) {
            device.status = 'vip';
            device.vipPlan = data.planType;
            const exp = new Date();
            if (data.planType === 'pro_weekly')
                exp.setDate(exp.getDate() + 7);
            else if (data.planType === 'pro_monthly')
                exp.setMonth(exp.getMonth() + 1);
            else
                exp.setFullYear(exp.getFullYear() + 1);
            device.vipExpiresAt = exp.toISOString().replace('T', ' ').substring(0, 19);
        }
        return newRecord;
    }
    getRevenueRecords() {
        return this.revenueRecords;
    }
    getRevenueAnalytics(period = 'month', fromDate, toDate) {
        const now = new Date();
        let startDate;
        let endDate = now;
        if (period === 'day') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        }
        else if (period === 'week') {
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);
        }
        else if (period === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        }
        else if (period === 'year') {
            startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
        }
        else if (period === 'custom' && fromDate) {
            startDate = new Date(fromDate);
            if (toDate)
                endDate = new Date(toDate + ' 23:59:59');
        }
        else {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        }
        const filtered = this.revenueRecords.filter(r => {
            const t = new Date(r.timestamp);
            return t >= startDate && t <= endDate && r.status === 'COMPLETED';
        });
        const totalUsd = filtered.reduce((acc, cur) => acc + cur.amountUsd, 0);
        const totalVnd = filtered.reduce((acc, cur) => acc + cur.amountVnd, 0);
        const totalOrders = filtered.length;
        // Phân loại theo gói
        const planBreakdown = {
            pro_weekly: filtered.filter(r => r.planType === 'pro_weekly').length,
            pro_monthly: filtered.filter(r => r.planType === 'pro_monthly').length,
            pro_yearly: filtered.filter(r => r.planType === 'pro_yearly').length,
        };
        // Phân loại trạng thái Users & Devices
        const totalDevices = this.devices.length;
        const vipDevices = this.devices.filter(d => d.status === 'vip').length;
        const cancelledDevices = this.devices.filter(d => d.status === 'cancelled').length;
        const freeDevices = this.devices.filter(d => d.status === 'free').length;
        const trialsUsedCount = this.devices.filter(d => d.aiTrialUsed).length;
        // Timeline data for charts
        const timelineMap = {};
        filtered.forEach(r => {
            const dateKey = r.timestamp.substring(0, 10);
            if (!timelineMap[dateKey])
                timelineMap[dateKey] = { usd: 0, vnd: 0, count: 0 };
            timelineMap[dateKey].usd += r.amountUsd;
            timelineMap[dateKey].vnd += r.amountVnd;
            timelineMap[dateKey].count += 1;
        });
        const timeline = Object.keys(timelineMap).sort().map(k => ({
            date: k,
            usd: Number(timelineMap[k].usd.toFixed(2)),
            vnd: timelineMap[k].vnd,
            orders: timelineMap[k].count,
        }));
        return {
            period,
            from: startDate.toISOString().substring(0, 10),
            to: endDate.toISOString().substring(0, 10),
            summary: {
                totalRevenueUsd: Number(totalUsd.toFixed(2)),
                totalRevenueVnd: totalVnd,
                totalOrders,
                averageOrderValueUsd: totalOrders > 0 ? Number((totalUsd / totalOrders).toFixed(2)) : 0,
                activeVipSubscribers: vipDevices,
                cancelledSubscribers: cancelledDevices,
                freeDevices,
                totalInstalledDevices: totalDevices,
                trialsUsedCount,
            },
            planBreakdown,
            timeline,
        };
    }
    // ==========================================
    // USERS & MEDIA & JOBS
    // ==========================================
    getUsers() {
        return this.users;
    }
    getUserById(id) {
        return this.users.find(u => u.id === id);
    }
    createUser(email, fullName, role = 'user') {
        const newUser = {
            id: `usr-${(0, uuid_1.v4)().substring(0, 8)}`,
            email,
            fullName,
            role,
            isVip: false,
            status: 'active',
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
        this.users.unshift(newUser);
        return newUser;
    }
    updateUser(id, updates) {
        const user = this.getUserById(id);
        if (!user)
            return null;
        Object.assign(user, updates);
        return user;
    }
    deleteUser(id) {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1)
            return false;
        this.users.splice(index, 1);
        return true;
    }
    getMediaFiles() {
        return this.mediaFiles;
    }
    /**
     * Thêm tệp media mới với thời hạn mặc định 60 phút
     * Add new media file with 60-minute default TTL
     */
    addMediaFile(file) {
        const now = Date.now();
        const createdAt = new Date(now).toISOString().replace('T', ' ').substring(0, 19);
        const expiresAt = new Date(now + 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19); // TTL: 60 minutes
        const newMedia = {
            ...file,
            id: `med-${(0, uuid_1.v4)().substring(0, 8)}`,
            createdAt,
            expiresAt,
        };
        this.mediaFiles.unshift(newMedia);
        return newMedia;
    }
    /**
     * Lấy danh sách tệp media đã quá hạn 60 phút cần dọn dẹp
     * Retrieve expired media files older than 60 minutes for cleanup
     */
    getExpiredMediaFiles(ttlMinutes = 60) {
        const thresholdTime = Date.now() - ttlMinutes * 60 * 1000;
        return this.mediaFiles.filter(m => {
            const createdTime = new Date(m.createdAt).getTime();
            return !isNaN(createdTime) && createdTime <= thresholdTime;
        });
    }
    deleteMediaFile(id) {
        const index = this.mediaFiles.findIndex(m => m.id === id);
        if (index === -1)
            return null;
        return this.mediaFiles.splice(index, 1)[0];
    }
    getJobs() {
        return this.jobs;
    }
    createJob(jobData) {
        const newJob = {
            ...jobData,
            id: `job-${(0, uuid_1.v4)().substring(0, 8)}`,
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
        this.jobs.unshift(newJob);
        return newJob;
    }
    // ==========================================
    // 6. AI PERSONA, GREETINGS & RULES (CMS Configurable)
    // ==========================================
    aiPersonaConfig = {
        personaName: 'NextAI Office Assistant',
        greetingVi: 'Xin chào! Tôi là Trợ Lý Văn Phòng NextAI. Tôi chuyên hỗ trợ bạn tóm tắt tài liệu (Word, Excel, PDF, PowerPoint), trích xuất thông tin quan trọng, dịch thuật đa ngữ và kiểm tra ngữ pháp. Hãy gửi câu hỏi hoặc đính kèm tệp tài liệu (tối đa 20MB) để bắt đầu!',
        greetingEn: 'Hello! I am NextAI Office Assistant. I specialize in document summarization (Word, Excel, PDF, PowerPoint), key information extraction, translation, and proofreading. Send a prompt or attach a document file (up to 20MB) to get started!',
        defaultReplyVi: 'Tôi đã tiếp nhận tài liệu và yêu cầu của bạn. Đây là bản phân tích chi tiết dựa trên dữ liệu văn phòng cung cấp.',
        defaultReplyEn: 'I have received your document and request. Here is the detailed analysis based on the provided office data.',
        placeholderVi: 'Hỏi AI bất kỳ điều gì...',
        placeholderEn: 'Ask AI anything...',
        quickPromptsVi: [
            '📝 Tóm tắt tài liệu',
            '🌐 Dịch thuật toàn cầu',
            '🔍 Trích xuất việc cần làm',
            '📊 Phân tích số liệu'
        ],
        quickPromptsEn: [
            '📝 Summarize Document',
            '🌐 World Translator',
            '🔍 Extract Action Items',
            '📊 Analyze Figures'
        ],
        systemPromptRules: 'Bạn là Trợ Lý Văn Phòng NextAI (NextAI Office Assistant) trong ứng dụng NextAI Office Suite.\n' +
            'Nhiệm vụ cốt lõi: Chuyên gia đọc hiểu, tóm tắt tài liệu văn phòng (Word DOC/DOCX, Excel XLS/XLSX, PowerPoint PPT/PPTX, PDF, TXT, CSV), trích xuất thông tin quan trọng, dịch thuật đa ngữ và kiểm tra ngữ pháp.\n' +
            'Khung luật & Giới hạn hoạt động (Guardrails):\n' +
            '1. Chỉ xử lý các tác vụ liên quan đến tài liệu, số liệu văn phòng, phân tích văn bản và giải đáp công việc.\n' +
            '2. Tuyệt đối không bịa đặt số liệu hay thông tin không có trong tài liệu người dùng cung cấp.\n' +
            '3. Lịch sự từ chối các yêu cầu ngoài phạm vi công việc văn phòng hoặc vi phạm đạo đức, định hướng người dùng quay lại xử lý văn bản.\n' +
            '4. Trả lời súc tích, văn phong chuyên nghiệp, có cấu trúc bullet point rõ ràng dễ đọc trên thiết bị di động.',
        autoSummaryPromptVi: 'Hãy tóm tắt và phân tích toàn bộ nội dung tệp tài liệu này.',
        autoSummaryPromptEn: 'Please summarize and analyze this entire document file.',
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    getAiPersonaConfigFilePath() {
        return path_1.default.resolve(__dirname, '../../data/ai_persona_config.json');
    }
    initAiPersonaConfig() {
        try {
            const filePath = this.getAiPersonaConfigFilePath();
            if (fs_1.default.existsSync(filePath)) {
                const raw = fs_1.default.readFileSync(filePath, 'utf-8');
                const parsed = JSON.parse(raw);
                this.aiPersonaConfig = { ...this.aiPersonaConfig, ...parsed };
            }
            else {
                this.saveAiPersonaToFile();
            }
        }
        catch (e) {
            console.warn('Could not load ai_persona_config.json:', e);
        }
    }
    getAiPersonaConfig() {
        return { ...this.aiPersonaConfig };
    }
    updateAiPersonaConfig(update) {
        this.aiPersonaConfig = {
            ...this.aiPersonaConfig,
            ...update,
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
        this.saveAiPersonaToFile();
        return { ...this.aiPersonaConfig };
    }
    saveAiPersonaToFile() {
        try {
            const filePath = this.getAiPersonaConfigFilePath();
            const dir = path_1.default.dirname(filePath);
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
            fs_1.default.writeFileSync(filePath, JSON.stringify(this.aiPersonaConfig, null, 2), 'utf-8');
        }
        catch (e) {
            console.warn('Could not save ai_persona_config.json:', e);
        }
    }
}
exports.dbService = new DatabaseService();
exports.dbService.initAiPersonaConfig();
