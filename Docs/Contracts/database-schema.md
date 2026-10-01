# DATABASE SCHEMA BLUEPRINT (DOCS/CONTRACTS/DATABASE-SCHEMA.MD)

> **Mục tiêu:** Định nghĩa cấu trúc lưu trữ dữ liệu Relational (PostgreSQL/SQLite) và OLAP (ClickHouse/DuckDB) tương đương 100% nghiệp vụ ứng dụng gốc.

---

## 1. Relational Database Schema

### 1.1 `users`
- `id` (UUID / SERIAL PRIMARY KEY)
- `email` (VARCHAR(255) UNIQUE)
- `password_hash` (VARCHAR(255))
- `role` (VARCHAR(50) DEFAULT 'user') -- 'admin', 'manager', 'user'
- `is_vip` (BOOLEAN DEFAULT FALSE)
- `vip_expires_at` (TIMESTAMP NULL)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### 1.2 `devices`
- `device_id` (VARCHAR(128) PRIMARY KEY)
- `user_id` (UUID REFERENCES users(id) ON DELETE SET NULL)
- `ad_id` (VARCHAR(128))
- `platform` (VARCHAR(20) DEFAULT 'android')
- `os_version` (VARCHAR(50))
- `app_version` (VARCHAR(50))
- `fcm_token` (TEXT)
- `adjust_id` (VARCHAR(128))
- `last_active_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### 1.3 `purchases`
- `order_id` (VARCHAR(128) PRIMARY KEY)
- `device_id` (VARCHAR(128) REFERENCES devices(device_id))
- `product_id` (VARCHAR(100) NOT NULL)
- `purchase_token` (TEXT NOT NULL)
- `purchase_state` (VARCHAR(50) DEFAULT 'ACTIVE') -- 'ACTIVE', 'CANCELLED', 'EXPIRED'
- `amount` (DECIMAL(10,2))
- `currency` (VARCHAR(10) DEFAULT 'USD')
- `purchase_time` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `expiry_time` (TIMESTAMP)

### 1.4 `conversion_jobs`
- `id` (UUID PRIMARY KEY)
- `device_id` (VARCHAR(128))
- `source_filename` (VARCHAR(255))
- `source_format` (VARCHAR(20)) -- 'hwp', 'docx', 'xlsx', 'pptx', 'pdf'
- `target_format` (VARCHAR(20)) -- 'pdf', 'docx', 'txt'
- `file_size_bytes` (BIGINT)
- `status` (VARCHAR(50) DEFAULT 'PENDING') -- 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'
- `download_url` (TEXT)
- `error_message` (TEXT)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `completed_at` (TIMESTAMP NULL)

### 1.5 `media_files` (Cloudflare R2 Catalog)
- `id` (UUID PRIMARY KEY)
- `filename` (VARCHAR(255) NOT NULL)
- `r2_key` (VARCHAR(500) NOT NULL UNIQUE)
- `r2_bucket` (VARCHAR(100) NOT NULL)
- `content_type` (VARCHAR(100))
- `size_bytes` (BIGINT)
- `public_url` (TEXT NOT NULL)
- `uploaded_by` (UUID REFERENCES users(id))
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

---

## 2. OLAP Analytics Schema (ClickHouse / DuckDB)

### 2.1 `telemetry_events`
- `event_time` (DateTime)
- `event_name` (LowCardinality(String)) -- 'read_file', 'ft_set_app_df', 'chat_ai', 'paywall_view', 'convert_start'
- `device_id` (String)
- `country` (LowCardinality(String))
- `app_version` (String)
- `doc_type` (LowCardinality(String)) -- 'word', 'pdf', 'excel', 'ppt', 'hwp'
- `session_duration_sec` (UInt32)
- `is_vip` (UInt8)
