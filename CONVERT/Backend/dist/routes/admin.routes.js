"use strict";
/**
 * Admin CMS Routes & Controllers / Định Tuyến Quản Trị Hệ Thống CMS (Port 1500)
 * Toàn diện 5 phân hệ quản lý:
 * 1. Quản lý API Key (Gemini, Grok, OpenAI)
 * 2. Quản lý Thiết Bị & User (Cài đặt, VIP, Đã hủy, Giới hạn dùng thử 1 lần)
 * 3. Quản lý Doanh Thu (Ngày / Tuần / Tháng / Năm / Từ ngày X -> Ngày Y)
 * 4. Quản lý Media Cloudflare R2 (Đồng bộ xóa sạch)
 * 5. Quản lý Tiến trình Convert
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const db_service_1 = require("../services/db.service");
const cloudflare_service_1 = require("../services/cloudflare.service");
exports.adminRouter = (0, express_1.Router)();
// ========================================================
// 1. DASHBOARD TỔNG QUAN
// ========================================================
exports.adminRouter.get('/stats', (_req, res) => {
    const users = db_service_1.dbService.getUsers();
    const devices = db_service_1.dbService.getDevices();
    const media = db_service_1.dbService.getMediaFiles();
    const jobs = db_service_1.dbService.getJobs();
    const apiKeys = db_service_1.dbService.getApiKeys();
    const revenueSummary = db_service_1.dbService.getRevenueAnalytics('month').summary;
    return res.status(200).json({
        success: true,
        stats: {
            totalUsers: users.length,
            totalDevices: devices.length,
            totalMediaFiles: media.length,
            totalJobs: jobs.length,
            activeVipUsers: devices.filter(d => d.status === 'vip').length,
            cancelledUsers: devices.filter(d => d.status === 'cancelled').length,
            freeDevices: devices.filter(d => d.status === 'free').length,
            activeApiKeys: apiKeys.filter(k => k.status === 'active').length,
            totalRevenueMonthUsd: revenueSummary.totalRevenueUsd,
            totalRevenueMonthVnd: revenueSummary.totalRevenueVnd,
            totalOrdersMonth: revenueSummary.totalOrders,
            serverPort: 1500,
        },
    });
});
// ========================================================
// 2. PHÂN HỆ QUẢN LÝ API KEY (Gemini & Grok xAI)
// ========================================================
exports.adminRouter.get('/api-keys', (_req, res) => {
    return res.status(200).json({
        success: true,
        apiKeys: db_service_1.dbService.getApiKeys(),
    });
});
exports.adminRouter.post('/api-keys', (req, res) => {
    const { provider, keyName, apiKey, model, quotaTotal = 1000000, note } = req.body;
    if (!provider || !keyName || !apiKey || !model) {
        return res.status(400).json({
            success: false,
            message: 'Các trường provider, keyName, apiKey, model là bắt buộc',
        });
    }
    const newKey = db_service_1.dbService.addApiKey({
        provider,
        keyName,
        apiKey,
        model,
        status: 'active',
        quotaTotal: Number(quotaTotal),
        note,
    });
    return res.status(201).json({ success: true, apiKey: newKey });
});
exports.adminRouter.put('/api-keys/:id', (req, res) => {
    const { id } = req.params;
    const updated = db_service_1.dbService.updateApiKey(id, req.body);
    if (!updated) {
        return res.status(404).json({ success: false, message: 'API Key không tồn tại' });
    }
    return res.status(200).json({ success: true, apiKey: updated });
});
exports.adminRouter.post('/api-keys/:id/toggle', (req, res) => {
    const { id } = req.params;
    const toggled = db_service_1.dbService.toggleApiKey(id);
    if (!toggled) {
        return res.status(404).json({ success: false, message: 'API Key không tồn tại' });
    }
    return res.status(200).json({ success: true, apiKey: toggled });
});
exports.adminRouter.delete('/api-keys/:id', (req, res) => {
    const { id } = req.params;
    const deleted = db_service_1.dbService.deleteApiKey(id);
    if (!deleted) {
        return res.status(404).json({ success: false, message: 'API Key không tồn tại' });
    }
    return res.status(200).json({ success: true, message: 'Đã xóa API Key thành công' });
});
// ========================================================
// 3. PHÂN HỆ QUẢN LÝ THIẾT BỊ & USER (Device ID & Dùng Thử 1 Lần)
// ========================================================
exports.adminRouter.get('/devices', (req, res) => {
    const statusFilter = req.query.status || 'all';
    const devices = db_service_1.dbService.getDevices(statusFilter);
    return res.status(200).json({ success: true, devices });
});
exports.adminRouter.post('/devices/:deviceId/toggle-vip', (req, res) => {
    const { deviceId } = req.params;
    const { plan = 'pro_yearly' } = req.body;
    const device = db_service_1.dbService.toggleDeviceVip(deviceId, plan);
    if (!device) {
        return res.status(404).json({ success: false, message: 'Thiết bị không tồn tại' });
    }
    return res.status(200).json({ success: true, device });
});
exports.adminRouter.post('/devices/:deviceId/reset-trial', (req, res) => {
    const { deviceId } = req.params;
    const device = db_service_1.dbService.resetDeviceTrial(deviceId);
    if (!device) {
        return res.status(404).json({ success: false, message: 'Thiết bị không tồn tại' });
    }
    return res.status(200).json({
        success: true,
        message: 'Đã reset lượt dùng thử 1 lần cho thiết bị này',
        device,
    });
});
// ========================================================
// 4. PHÂN HỆ QUẢN LÝ DOANH THU (Ngày / Tuần / Tháng / Năm / X -> Y)
// ========================================================
exports.adminRouter.get('/revenue/analytics', (req, res) => {
    const period = req.query.period || 'month';
    const from = req.query.from;
    const to = req.query.to;
    const analytics = db_service_1.dbService.getRevenueAnalytics(period, from, to);
    return res.status(200).json({ success: true, analytics });
});
exports.adminRouter.get('/revenue/transactions', (_req, res) => {
    return res.status(200).json({
        success: true,
        transactions: db_service_1.dbService.getRevenueRecords(),
    });
});
// Mô phỏng giao dịch mua hàng để test doanh thu thời gian thực
exports.adminRouter.post('/revenue/mock-purchase', (req, res) => {
    const { deviceId = 'dev-samsung-a50s-chairman', planType = 'pro_yearly', userEmail = 'chairman@nextai.com' } = req.body;
    let amountUsd = 39.99;
    let amountVnd = 1050000;
    if (planType === 'pro_weekly') {
        amountUsd = 4.99;
        amountVnd = 130000;
    }
    else if (planType === 'pro_monthly') {
        amountUsd = 14.99;
        amountVnd = 390000;
    }
    const record = db_service_1.dbService.addRevenueRecord({
        orderId: `GPA.${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().substring(6)}`,
        deviceId,
        userEmail,
        planType,
        amountUsd,
        amountVnd,
        currency: 'VND',
        status: 'COMPLETED',
        paymentMethod: 'Google Play Billing',
    });
    return res.status(201).json({ success: true, record });
});
// ========================================================
// 5. USER CRUD & MEDIA & CONVERSIONS
// ========================================================
exports.adminRouter.get('/users', (_req, res) => {
    return res.status(200).json({ success: true, users: db_service_1.dbService.getUsers() });
});
exports.adminRouter.post('/users', (req, res) => {
    const { email, fullName, role = 'user' } = req.body;
    if (!email || !fullName) {
        return res.status(400).json({ success: false, message: 'Email và Họ tên là bắt buộc' });
    }
    const user = db_service_1.dbService.createUser(email, fullName, role);
    return res.status(201).json({ success: true, user });
});
exports.adminRouter.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const deleted = db_service_1.dbService.deleteUser(id);
    if (!deleted) {
        return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }
    return res.status(200).json({ success: true, message: 'Đã xóa người dùng thành công' });
});
exports.adminRouter.get('/media', (_req, res) => {
    return res.status(200).json({ success: true, media: db_service_1.dbService.getMediaFiles() });
});
exports.adminRouter.delete('/media/:id', async (req, res) => {
    const { id } = req.params;
    const result = await cloudflare_service_1.cloudflareService.deleteMediaSynchronously(id);
    return res.status(200).json(result);
});
exports.adminRouter.get('/conversions', (_req, res) => {
    return res.status(200).json({ success: true, jobs: db_service_1.dbService.getJobs() });
});
// ========================================================
// 6. PHÂN HỆ QUẢN TRỊ AI PERSONA & KHUNG LUẬT (CMS)
// ========================================================
exports.adminRouter.get('/ai-config', (_req, res) => {
    return res.status(200).json({
        success: true,
        config: db_service_1.dbService.getAiPersonaConfig(),
    });
});
exports.adminRouter.post('/ai-config', (req, res) => {
    const updated = db_service_1.dbService.updateAiPersonaConfig(req.body);
    return res.status(200).json({
        success: true,
        message: 'Cập nhật cấu hình AI Persona, Câu chào & Khung luật thành công!',
        config: updated,
    });
});
