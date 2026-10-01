"use strict";
/**
 * NextAI Office Suite - Backend Server & Web CMS Entrypoint
 * Port: 6033
 * Dual-stack TypeScript/Node.js + Go Microservice
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const config_1 = require("./config");
const api_routes_1 = require("./routes/api.routes");
const admin_routes_1 = require("./routes/admin.routes");
const cloudflare_service_1 = require("./services/cloudflare.service");
const app = (0, express_1.default)();
// Middleware setup
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Standard Security Headers / Thiết lập tiêu chuẩn bảo mật HTTP Headers
app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});
// Serve static assets for Admin CMS
app.use('/admin-assets', express_1.default.static(path_1.default.join(__dirname, 'cms/public')));
// Swagger Interactive API Docs at /docs
try {
    const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, '../../Docs/Contracts/openapi.yaml'));
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
}
catch (err) {
    console.warn('Swagger YAML load skipped (using fallback OpenAPI spec endpoint)');
}
// REST API Endpoints
app.use('/api/v1', api_routes_1.apiRouter);
// Admin CMS API Endpoints
app.use('/admin', admin_routes_1.adminRouter);
// Serve Admin CMS Single-Page Application for all /admin routes
app.get([
    '/',
    '/admin',
    '/admin/*',
    '/admin/dashboard',
    '/admin/revenue',
    '/admin/devices',
    '/admin/api-keys',
    '/admin/users',
    '/admin/media',
    '/admin/conversions'
], (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'cms/views/admin.html'));
});
// Mock Download Endpoint for Converted Documents with Header Sanitization
app.get('/api/v1/download/:jobId/:filename', (req, res) => {
    const { filename } = req.params;
    const safeFilename = path_1.default.basename(filename || 'document.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(`[NextAI Office Conversion Engine - Converted Output for ${safeFilename}]`);
});
// Start Server on Port 1500 & Mirror Port 6033
app.listen(config_1.config.port, () => {
    console.log(`==========================================================`);
    console.log(`🚀 NextAI Office Suite Backend & Modern Web CMS`);
    console.log(`📡 Server running on: http://localhost:${config_1.config.port}`);
    console.log(`📊 CMS Web Admin:    http://localhost:${config_1.config.port}/admin/dashboard`);
    console.log(`📖 Swagger API Docs: http://localhost:${config_1.config.port}/docs`);
    console.log(`🔑 API Key Manager:  http://localhost:${config_1.config.port}/admin/api-keys`);
    console.log(`💰 Revenue Manager:  http://localhost:${config_1.config.port}/admin/revenue`);
    console.log(`☁️ Cloudflare R2:    Auto-cleanup enabled (TTL: 60 minutes)`);
    console.log(`==========================================================`);
    // Activate Cloudflare R2 auto-cleanup background task (Deletes files after 60 min)
    cloudflare_service_1.cloudflareService.startAutoCleanupScheduler(60000);
});
// Dual listener on Port 6033 (AGENTS.md canonical port)
if (Number(config_1.config.port) !== 6033) {
    try {
        app.listen(6033, () => {
            console.log(`📡 Mirror Port 6033 active: http://localhost:6033/admin/dashboard`);
        });
    }
    catch (e) {
        // Port 6033 fallback
    }
}
exports.default = app;
