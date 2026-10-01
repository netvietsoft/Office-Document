/**
 * Cross-platform script to copy CMS assets from src/cms to dist/cms
 * Kịch bản đa nền tảng sao chép tài nguyên CMS từ src/cms sang dist/cms
 */
const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }
    const entries = fs.readdirSync(from, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(from, entry.name);
        const destPath = path.join(to, entry.name);
        if (entry.isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

const srcDir = path.resolve(__dirname, '../src/cms');
const destDir = path.resolve(__dirname, '../dist/cms');

if (fs.existsSync(srcDir)) {
    copyFolderSync(srcDir, destDir);
    console.log(`[Build] Successfully copied CMS assets from ${srcDir} to ${destDir}`);
} else {
    console.warn(`[Build] Warning: Source directory ${srcDir} does not exist.`);
}
