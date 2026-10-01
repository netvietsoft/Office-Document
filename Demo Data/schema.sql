-- ======================================================================
-- NEXTAI OFFICE SUITE - RELATIONAL DATABASE SCHEMA (PostgreSQL / SQLite)
-- Port / Service: 6033 Backend API & CMS Admin
-- ======================================================================

-- 1. Users Table (Quản lý người dùng & Admin hệ thống)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user', -- 'admin', 'manager', 'user'
    is_vip BOOLEAN DEFAULT FALSE,
    vip_expires_at TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'suspended'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Devices Table (Quản lý thiết bị di động cài đặt app)
CREATE TABLE IF NOT EXISTS devices (
    device_id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(36),
    ad_id VARCHAR(128),
    platform VARCHAR(20) DEFAULT 'android',
    os_version VARCHAR(50),
    app_version VARCHAR(50),
    fcm_token TEXT,
    adjust_token VARCHAR(128),
    country VARCHAR(10) DEFAULT 'US',
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Purchases Table (Lịch sử giao dịch & xác thực IAP Google Play)
CREATE TABLE IF NOT EXISTS purchases (
    order_id VARCHAR(128) PRIMARY KEY,
    device_id VARCHAR(128) NOT NULL,
    user_id VARCHAR(36),
    product_id VARCHAR(100) NOT NULL,
    purchase_token TEXT NOT NULL,
    purchase_state VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'CANCELLED', 'EXPIRED'
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    purchase_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_time TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. Conversion Jobs Table (Quản lý tiến trình convert tài liệu)
CREATE TABLE IF NOT EXISTS conversion_jobs (
    id VARCHAR(36) PRIMARY KEY,
    device_id VARCHAR(128) NOT NULL,
    source_filename VARCHAR(255) NOT NULL,
    source_format VARCHAR(20) NOT NULL, -- 'hwp', 'docx', 'xlsx', 'pptx', 'pdf'
    target_format VARCHAR(20) NOT NULL, -- 'docx', 'pdf', 'txt'
    file_size_bytes BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'
    download_url TEXT,
    error_message TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

-- 5. Media Files Table (Tài nguyên Cloudflare R2 - Xóa đồng bộ tránh file mồ côi)
CREATE TABLE IF NOT EXISTS media_files (
    id VARCHAR(36) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    r2_key VARCHAR(500) NOT NULL UNIQUE,
    r2_bucket VARCHAR(100) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    public_url TEXT NOT NULL,
    uploaded_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 6. Paywall Configs Table (Cấu hình A/B Testing Paywall & Bảng giá)
CREATE TABLE IF NOT EXISTS paywall_configs (
    id VARCHAR(36) PRIMARY KEY,
    config_name VARCHAR(100) NOT NULL,
    variant_type VARCHAR(50) NOT NULL, -- 'normal', 'sale_promo', 'super_sale', 'vertical'
    headline VARCHAR(255) NOT NULL,
    discount_percent INTEGER DEFAULT 0,
    trial_days INTEGER DEFAULT 0,
    featured_product_id VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    target_countries TEXT DEFAULT 'ALL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
