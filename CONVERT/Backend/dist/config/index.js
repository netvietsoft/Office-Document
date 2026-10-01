"use strict";
/**
 * Configuration Module / Module Cấu Hình Hệ Thống
 * Loads environment variables and provides global application constants.
 * Nạp các biến môi trường và cung cấp hằng số cho toàn ứng dụng.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || '1500', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'nextai_jwt_super_secret_key_change_in_production_2026',
    // Cloudflare R2 Credentials
    cloudflare: {
        accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID || 'demo_account_id',
        accessKey: process.env.CLOUDFLARE_R2_ACCESS_KEY || 'demo_access_key',
        secretKey: process.env.CLOUDFLARE_R2_SECRET_KEY || 'demo_secret_key',
        bucket: process.env.CLOUDFLARE_R2_BUCKET || 'office-document',
        endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://media.nextaitechnology.com',
    },
    // AI Assistant Credentials / Khóa API AI (Gemini, Grok, OpenAI)
    ai: {
        geminiApiKey: process.env.GEMINI_API_KEY || 'AIzaSyB_NextAI_Gemini_Production_Key_2026',
        grokApiKey: process.env.GROK_API_KEY || 'xai-grok-NextAI-Production-Live-Key-2026',
        openaiApiKey: process.env.OPENAI_API_KEY || 'demo-openai-key',
    },
};
