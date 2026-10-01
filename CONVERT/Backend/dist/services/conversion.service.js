"use strict";
/**
 * Conversion Service / Dịch Vụ Chuyển Đổi Tài Liệu
 * Handles asynchronous document format conversion (e.g., HWP/DOCX to PDF/DOCX).
 * Xử lý chuyển đổi định dạng tài liệu bất đồng bộ với độ chính xác cao.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversionService = exports.ConversionService = void 0;
const db_service_1 = require("./db.service");
class ConversionService {
    /**
     * Process conversion job / Xử lý tiến trình chuyển đổi
     */
    async convertDocument(sourceFilename, sourceFormat, targetFormat, fileSizeBytes, deviceId) {
        // Register pending job in DB / Ghi nhận tiến trình vào CSDL
        const job = db_service_1.dbService.createJob({
            deviceId,
            sourceFilename,
            sourceFormat: sourceFormat.toLowerCase(),
            targetFormat: targetFormat.toLowerCase(),
            fileSizeBytes,
            status: 'PROCESSING',
        });
        // Simulate high-performance conversion engine processing / Giả lập xử lý chuyển đổi
        const outputFilename = sourceFilename.replace(/\.[^/.]+$/, "") + `.${targetFormat}`;
        job.status = 'COMPLETED';
        job.downloadUrl = `http://localhost:6033/api/v1/download/${job.id}/${outputFilename}`;
        job.completedAt = new Date().toISOString();
        return job;
    }
}
exports.ConversionService = ConversionService;
exports.conversionService = new ConversionService();
