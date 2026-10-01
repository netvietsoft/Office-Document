-- ======================================================================
-- NEXTAI OFFICE SUITE - SQL ANALYTICAL & REPORTING QUERIES
-- Truy vấn phân tích người dùng, thiết bị, IAP, và tiến trình chuyển đổi
-- ======================================================================

-- 1. Thống kê tổng quan Dashboard CMS (Users, Thiết bị active, Doanh thu, VIP)
SELECT 
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM devices) AS total_devices,
    (SELECT COUNT(*) FROM devices WHERE last_active_at >= datetime('now', '-7 days')) AS active_devices_7d,
    (SELECT COUNT(*) FROM purchases WHERE purchase_state = 'ACTIVE') AS active_vip_subs,
    (SELECT COALESCE(SUM(amount), 0) FROM purchases WHERE purchase_state = 'ACTIVE') AS total_mrr_usd;

-- 2. Thống kê doanh thu theo từng gói Subscription (IAP Product Performance)
SELECT 
    product_id,
    COUNT(order_id) AS total_orders,
    SUM(amount) AS total_revenue_usd,
    AVG(amount) AS avg_order_value_usd
FROM purchases
WHERE purchase_state = 'ACTIVE'
GROUP BY product_id
ORDER BY total_revenue_usd DESC;

-- 3. Báo cáo hiệu năng hàng đợi chuyển đổi file (Conversion Jobs Queue Status)
SELECT 
    source_format,
    target_format,
    status,
    COUNT(*) AS total_jobs,
    AVG(duration_ms) AS avg_duration_ms,
    ROUND(AVG(file_size_bytes) / 1024.0 / 1024.0, 2) AS avg_file_size_mb
FROM conversion_jobs
GROUP BY source_format, target_format, status;

-- 4. Báo cáo hành vi đọc file & Tần suất sử dụng tính năng AI (OLAP Telemetry)
SELECT 
    doc_type,
    COUNT(*) AS read_count,
    ROUND(AVG(session_duration_sec) / 60.0, 2) AS avg_read_time_minutes,
    SUM(CASE WHEN is_vip = 1 THEN 1 ELSE 0 END) AS vip_reads,
    SUM(CASE WHEN is_vip = 0 THEN 1 ELSE 0 END) AS free_reads
FROM telemetry_events
WHERE event_name = 'read_file'
GROUP BY doc_type
ORDER BY read_count DESC;

-- 5. Kiểm tra danh sách file Cloudflare R2 và dung lượng lưu trữ
SELECT 
    content_type,
    COUNT(*) AS file_count,
    ROUND(SUM(size_bytes) / 1024.0 / 1024.0, 2) AS total_size_mb
FROM media_files
GROUP BY content_type;
