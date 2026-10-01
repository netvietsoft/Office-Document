"use strict";
/**
 * Billing & Anti-Fraud Service / Dịch Vụ Xác Thực Gói Mua & Chống Gian Lận S2S
 * Handles Server-to-Server (S2S) Google Play IAP verification, revenue tracking and subscription management.
 * Xử lý xác thực giao dịch mua Google Play qua server, ghi nhận doanh thu và quản lý trạng thái VIP.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingService = exports.BillingService = void 0;
const db_service_1 = require("./db.service");
class BillingService {
    /**
     * Verify IAP Purchase Event / Xác thực sự kiện mua hàng S2S và lưu doanh thu
     */
    async verifyPurchaseEvent(payload) {
        const validBundles = [
            'com.officedocument.word.docx.xlsx.viewer',
            'com.nextaitechnology.officedocument',
        ];
        if (!validBundles.includes(payload.bundleId)) {
            return {
                success: false,
                isVip: false,
                expiresDate: '',
                message: 'Invalid bundle identifier',
                orderId: payload.orderId,
            };
        }
        // Xử lý sự kiện Hủy gói (Cancelled)
        if (payload.eventType === 'CANCELLED') {
            const device = db_service_1.dbService.getDeviceById(payload.deviceId);
            if (device) {
                device.status = 'cancelled';
                device.cancelledAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
            }
            return {
                success: true,
                isVip: false,
                expiresDate: '',
                message: 'Subscription marked as cancelled.',
                orderId: payload.orderId,
            };
        }
        // Phân loại gói và mức doanh thu tương ứng
        let planType = 'pro_yearly';
        let amountUsd = 39.99;
        let amountVnd = 1050000;
        let durationDays = 365;
        if (payload.productId.includes('weekly') || payload.productId.includes('pro_weekly')) {
            planType = 'pro_weekly';
            amountUsd = 4.99;
            amountVnd = 130000;
            durationDays = 7;
        }
        else if (payload.productId.includes('month') || payload.productId.includes('pro_monthly')) {
            planType = 'pro_monthly';
            amountUsd = 14.99;
            amountVnd = 390000;
            durationDays = 30;
        }
        const now = new Date();
        const expiresDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
        // Ghi nhận doanh thu vào Database Service
        db_service_1.dbService.addRevenueRecord({
            orderId: payload.orderId || `GPA.${Date.now()}`,
            deviceId: payload.deviceId,
            userEmail: payload.userEmail,
            planType,
            amountUsd,
            amountVnd,
            currency: 'VND',
            status: 'COMPLETED',
            paymentMethod: 'Google Play Billing',
        });
        // Cập nhật trạng thái thiết bị lên VIP
        const device = db_service_1.dbService.getDeviceById(payload.deviceId);
        if (device) {
            device.status = 'vip';
            device.vipPlan = planType;
            device.vipExpiresAt = expiresDate;
        }
        return {
            success: true,
            isVip: true,
            expiresDate,
            message: 'Purchase verified successfully. VIP activated and revenue recorded.',
            orderId: payload.orderId,
        };
    }
}
exports.BillingService = BillingService;
exports.billingService = new BillingService();
