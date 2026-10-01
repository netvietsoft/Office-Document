"use strict";
/**
 * Mobile Client REST API Routes / Định Tuyến API REST Dành Cho Mobile Client
 * Cung cấp đầy đủ các cổng giao tiếp dành cho Android App:
 * 1. /api/v1/devices/verify-quota: Khống chế dùng thử AI đúng 1 lần duy nhất theo mã thiết bị (Device ID)
 * 2. /api/v1/devices/register: Đăng ký & cập nhật thiết bị
 * 3. /api/v1/config/ai-keys: Cung cấp thông tin model AI (Gemini & Grok) kết nối lên app
 * 4. /api/v1/ai/chat: Gateway xử lý tóm tắt, hỏi đáp, dịch thuật văn phòng
 * 5. /api/v1/android-event: Xác thực S2S mua gói Google Play và lưu doanh thu
 * 6. /api/v1/convert: Chuyển đổi tài liệu
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const conversion_service_1 = require("../services/conversion.service");
const billing_service_1 = require("../services/billing.service");
const ai_service_1 = require("../services/ai.service");
const db_service_1 = require("../services/db.service");
exports.apiRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({ limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit
// 1. Quản lý Thiết bị & Khống chế dùng thử AI 1 lần duy nhất theo mã thiết bị
exports.apiRouter.post('/devices/verify-quota', (req, res) => {
    try {
        const { deviceId, feature = 'chat' } = req.body;
        if (!deviceId) {
            return res.status(400).json({ success: false, message: 'deviceId is required' });
        }
        const quotaResult = db_service_1.dbService.verifyAndConsumeAiQuota(deviceId, feature);
        return res.status(200).json({
            success: true,
            deviceId,
            ...quotaResult,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
// 2. Đăng ký / Cập nhật thiết bị mới cài đặt
exports.apiRouter.post('/devices/register', (req, res) => {
    try {
        const { deviceId, userId, adId, platform, osVersion, appVersion, country, fcmToken } = req.body;
        if (!deviceId) {
            return res.status(400).json({ success: false, message: 'deviceId is required' });
        }
        const device = db_service_1.dbService.registerDevice({
            deviceId,
            userId,
            adId,
            platform,
            osVersion,
            appVersion,
            country,
            fcmToken,
        });
        return res.status(200).json({
            success: true,
            device,
            canUseFreeTrial: !device.aiTrialUsed,
            isVip: device.status === 'vip',
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
// 3. Cấu hình AI Provider & API Keys kết nối lên App (Gemini & Grok)
exports.apiRouter.get('/config/ai-keys', (_req, res) => {
    try {
        const apiKeys = db_service_1.dbService.getApiKeys().filter(k => k.status === 'active');
        // Trả về danh sách model sẵn sàng phục vụ app
        const models = apiKeys.map(k => ({
            provider: k.provider,
            keyName: k.keyName,
            model: k.model,
            status: k.status,
        }));
        return res.status(200).json({
            success: true,
            defaultProvider: 'gemini',
            availableProviders: ['gemini', 'grok'],
            models,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
// 3b. Cấu hình AI Persona, Câu chào & Khung luật hoạt động (Không hardcode trên Mobile)
exports.apiRouter.get('/config/ai-persona', (_req, res) => {
    try {
        const config = db_service_1.dbService.getAiPersonaConfig();
        return res.status(200).json({
            success: true,
            config,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
// 4. Trợ lý AI Gateway (Hỏi đáp, Tóm tắt, Dịch thuật)
exports.apiRouter.post('/ai/chat', async (req, res) => {
    try {
        const { prompt = '', context = '', action = 'chat', targetLanguage, provider = 'gemini', deviceId } = req.body;
        // Kiểm tra quota nếu có deviceId gửi lên
        if (deviceId) {
            const quota = db_service_1.dbService.verifyAndConsumeAiQuota(deviceId, action);
            if (!quota.allowed) {
                return res.status(403).json({
                    success: false,
                    code: 'SUBSCRIPTION_REQUIRED',
                    error: quota.message,
                    message: quota.message,
                    isVip: false,
                    remainingTrials: 0,
                });
            }
        }
        const result = await ai_service_1.aiService.processRequest({
            prompt,
            context,
            action,
            targetLanguage,
            provider,
            deviceId,
        });
        return res.status(200).json({
            success: true,
            text: result.response,
            response: result.response,
            tokens: result.tokensUsed,
            tokensUsed: result.tokensUsed,
            action: result.action,
            model: result.model,
            provider: result.provider,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
// 5. Server-to-Server (S2S) IAP Verification / Lưu Doanh Thu Google Play
exports.apiRouter.post('/android-event', async (req, res) => {
    try {
        const { adId, bundleId = 'com.officedocument.word.docx.xlsx.viewer', productId = 'pro_yearly', orderId = `GPA.${Date.now()}`, purchaseToken = 'sample_token_hash', adjustToken, deviceId = 'dev-default', userEmail, eventType = 'PURCHASED', } = req.body;
        const result = await billing_service_1.billingService.verifyPurchaseEvent({
            adId,
            bundleId,
            productId,
            orderId,
            purchaseToken,
            adjustToken,
            deviceId,
            userEmail,
            eventType,
        });
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
// 6. Chuyển đổi định dạng file (Document Conversion)
exports.apiRouter.post('/convert', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const { outputFormat = 'docx', deviceId = 'dev-unknown' } = req.body;
        const sourceFilename = file ? file.originalname : 'sample_doc.hwp';
        const sourceFormat = sourceFilename.split('.').pop() || 'hwp';
        const fileSizeBytes = file ? file.size : 1024 * 500;
        const job = await conversion_service_1.conversionService.convertDocument(sourceFilename, sourceFormat, outputFormat, fileSizeBytes, deviceId);
        return res.status(200).json({
            success: true,
            jobId: job.id,
            downloadUrl: job.downloadUrl,
            sourceFilename: job.sourceFilename,
            targetFormat: job.targetFormat,
            status: job.status,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
