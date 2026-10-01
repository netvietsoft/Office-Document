-- ======================================================================
-- NEXTAI OFFICE SUITE - OLAP ANALYTICS SCHEMA (ClickHouse / DuckDB)
-- Tracking telemetry, ad frequency, retention, document behaviors
-- ======================================================================

CREATE TABLE IF NOT EXISTS telemetry_events (
    event_time TIMESTAMP NOT NULL,
    event_name VARCHAR(50) NOT NULL, -- 'read_file', 'read_file_edit', 'ft_set_app_df', 'chat_ai', 'paywall_view', 'paywall_click'
    device_id VARCHAR(128) NOT NULL,
    country VARCHAR(10) NOT NULL,
    app_version VARCHAR(20) NOT NULL,
    doc_type VARCHAR(20), -- 'word', 'excel', 'ppt', 'pdf', 'hwp', 'txt'
    session_duration_sec INTEGER DEFAULT 0,
    is_vip INTEGER DEFAULT 0, -- 1 if VIP, 0 otherwise
    extra_payload TEXT
);

CREATE TABLE IF NOT EXISTS ad_impressions_daily (
    report_date DATE NOT NULL,
    ad_network VARCHAR(50) NOT NULL, -- 'admob', 'applovin_max', 'inmobi', 'unity', 'pangle'
    ad_format VARCHAR(30) NOT NULL, -- 'interstitial', 'rewarded', 'native', 'banner', 'app_open'
    country VARCHAR(10) NOT NULL,
    impressions_count BIGINT DEFAULT 0,
    clicks_count BIGINT DEFAULT 0,
    estimated_revenue_usd DECIMAL(12,4) DEFAULT 0.0000
);
