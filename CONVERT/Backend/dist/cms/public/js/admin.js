/**
 * NextAI Office Suite - Web CMS Admin Logic (Port 1500)
 * Toàn diện 6 phân hệ quản lý:
 * 1. Doanh thu (Ngày/Tuần/Tháng/Năm/Từ ngày X -> Ngày Y) & Biểu đồ SVG
 * 2. API Key (Gemini, Grok xAI, OpenAI)
 * 3. Thiết Bị (Device ID & Khống chế dùng thử 1 lần)
 * 4. Sổ giao dịch Google Play Billing
 * 5. Người dùng, Media R2 & Tiến trình Convert
 */

let currentRevenuePeriod = 'month';
let currentDeviceFilter = 'all';
let allDevicesCache = [];

// ==========================================
// 1. THEME MANAGEMENT (Sáng / Tối)
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem('nextai_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButtonText(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('nextai_theme', next);
  updateThemeButtonText(next);
  // Re-render chart with appropriate theme colors if on dashboard
  if (document.getElementById('tab-dashboard').style.display !== 'none') {
    loadRevenueAnalytics();
  }
}

function updateThemeButtonText(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
}

// ==========================================
// 2. NAVIGATION & TABS
// ==========================================
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

  const activeContent = document.getElementById(`tab-${tabId}`);
  const activeNav = document.getElementById(`nav-${tabId}`);

  if (activeContent) activeContent.style.display = 'block';
  if (activeNav) activeNav.classList.add('active');

  const titleMap = {
    'dashboard': 'Dashboard & Quản Lý Doanh Thu (Port 1500)',
    'api-keys': 'Quản Lý Khóa API AI (Gemini & Grok xAI)',
    'devices': 'Quản Lý Thiết Bị Cài Đặt (Device ID & Quota Dùng Thử 1 Lần)',
    'revenue': 'Sổ Giao Dịch Đơn Hàng Google Play',
    'users': 'Người Dùng & Quản Trị Hệ Thống',
    'media': 'Quản Lý Media & Banners (Cloudflare R2)',
    'conversions': 'Tiến Trình Chuyển Đổi Tài Liệu',
    'ai-config': 'Cấu Hình AI Persona, Câu Chào & Khung Luật AI',
  };
  document.getElementById('current-page-title').innerText = titleMap[tabId] || 'Admin Portal';

  if (tabId === 'dashboard') loadRevenueAnalytics();
  if (tabId === 'api-keys') loadApiKeys();
  if (tabId === 'devices') loadDevices();
  if (tabId === 'revenue') loadRevenueTransactions();
  if (tabId === 'users') loadUsers();
  if (tabId === 'media') loadMedia();
  if (tabId === 'conversions') loadConversions();
  if (tabId === 'ai-config') loadAiPersonaConfig();
}

// ==========================================
// 3. REVENUE ANALYTICS (Ngày/Tuần/Tháng/Năm/X->Y)
// ==========================================
function changeRevenuePeriod(period) {
  currentRevenuePeriod = period;
  document.querySelectorAll('.filter-bar .filter-pill').forEach(btn => {
    btn.classList.remove('active');
    if (btn.innerText.toLowerCase().includes(period === 'day' ? 'hôm nay' : period === 'week' ? '7 ngày' : period === 'month' ? 'tháng' : 'năm')) {
      btn.classList.add('active');
    }
  });
  loadRevenueAnalytics();
}

function applyCustomDateRevenue() {
  const from = document.getElementById('revenue-from-date').value;
  const to = document.getElementById('revenue-to-date').value;
  if (!from) {
    alert('Vui lòng chọn ngày bắt đầu (Từ ngày X)');
    return;
  }
  currentRevenuePeriod = 'custom';
  document.querySelectorAll('.filter-bar .filter-pill').forEach(btn => btn.classList.remove('active'));
  loadRevenueAnalytics(from, to);
}

async function loadRevenueAnalytics(customFrom, customTo) {
  try {
    let url = `/admin/revenue/analytics?period=${currentRevenuePeriod}`;
    if (customFrom) url += `&from=${customFrom}`;
    if (customTo) url += `&to=${customTo}`;

    const res = await fetch(url);
    const data = await res.json();
    if (!data.success) return;

    const s = data.analytics.summary;
    const b = data.analytics.planBreakdown;

    // Cập nhật thẻ KPI
    document.getElementById('stat-revenue-vnd').innerText = `${s.totalRevenueVnd.toLocaleString('vi-VN')} ₫`;
    document.getElementById('stat-revenue-usd').innerText = `≈ $${s.totalRevenueUsd.toFixed(2)} USD`;
    document.getElementById('stat-orders-count').innerText = `${s.totalOrders} đơn hàng`;
    document.getElementById('stat-aov').innerText = `AOV: $${s.averageOrderValueUsd.toFixed(2)} / đơn`;
    document.getElementById('stat-active-vip').innerText = `${s.activeVipSubscribers} VIP`;
    document.getElementById('stat-cancelled-vip').innerText = `Đã hủy: ${s.cancelledSubscribers} thuê bao`;
    document.getElementById('stat-total-devices').innerText = `${s.totalInstalledDevices} máy`;
    document.getElementById('stat-trials-used').innerText = `Đã dùng hết 1 lần demo: ${s.trialsUsedCount} máy`;

    // Cập nhật cơ cấu gói
    document.getElementById('breakdown-yearly').innerText = `${b.pro_yearly} đơn (${b.pro_yearly > 0 ? ((b.pro_yearly / s.totalOrders) * 100).toFixed(0) : 0}%)`;
    document.getElementById('breakdown-monthly').innerText = `${b.pro_monthly} đơn (${b.pro_monthly > 0 ? ((b.pro_monthly / s.totalOrders) * 100).toFixed(0) : 0}%)`;
    document.getElementById('breakdown-weekly').innerText = `${b.pro_weekly} đơn (${b.pro_weekly > 0 ? ((b.pro_weekly / s.totalOrders) * 100).toFixed(0) : 0}%)`;

    // Render biểu đồ SVG
    renderRevenueChart(data.analytics.timeline);
  } catch (err) {
    console.error('Failed to load revenue analytics:', err);
  }
}

function renderRevenueChart(timeline) {
  const container = document.getElementById('revenue-chart-container');
  if (!timeline || timeline.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-secondary);">Chưa có dữ liệu giao dịch trong khoảng thời gian này. Bấm nút <strong>+ Mô Phỏng Mua Gói VIP</strong> để tạo dữ liệu kiểm thử.</div>`;
    return;
  }

  const maxUsd = Math.max(...timeline.map(t => t.usd), 50);
  const chartHeight = 180;
  const chartWidth = 700;
  const barWidth = Math.min(45, Math.max(22, (chartWidth / timeline.length) - 18));

  let barsHtml = '';
  let labelsHtml = '';

  timeline.forEach((item, index) => {
    const x = 40 + index * ((chartWidth - 60) / timeline.length);
    const barHeight = Math.max(12, (item.usd / maxUsd) * (chartHeight - 40));
    const y = chartHeight - barHeight;

    barsHtml += `
      <g class="chart-bar-group">
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="5" fill="url(#barGradient)" />
        <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--text-primary)">$${item.usd.toFixed(0)}</text>
      </g>
    `;

    labelsHtml += `
      <text x="${x + barWidth / 2}" y="${chartHeight + 20}" text-anchor="middle" font-size="10.5" font-weight="500" fill="var(--text-secondary)">${item.date.substring(5)}</text>
    `;
  });

  container.innerHTML = `
    <div style="overflow-x: auto;">
      <svg width="100%" height="220" viewBox="0 0 ${chartWidth + 40} 220" preserveAspectRatio="xMidYMid meet" style="display: block;">
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3B82F6" />
            <stop offset="100%" stop-color="#1D4ED8" />
          </linearGradient>
        </defs>
        <!-- Horizontal Grid Lines -->
        <line x1="20" y1="${chartHeight}" x2="${chartWidth + 20}" y2="${chartHeight}" stroke="var(--border-color)" stroke-width="1" />
        <line x1="20" y1="${chartHeight / 2}" x2="${chartWidth + 20}" y2="${chartHeight / 2}" stroke="var(--border-color)" stroke-dasharray="4" stroke-width="1" />
        ${barsHtml}
        ${labelsHtml}
      </svg>
    </div>
  `;
}

async function simulateTestPurchase() {
  const plans = ['pro_weekly', 'pro_monthly', 'pro_yearly'];
  const randomPlan = plans[Math.floor(Math.random() * plans.length)];
  const randomEmail = `customer_${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;

  await fetch('/admin/revenue/mock-purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planType: randomPlan,
      userEmail: randomEmail,
      deviceId: `dev-simulated-${Math.floor(100 + Math.random() * 900)}`,
    }),
  });

  loadRevenueAnalytics();
  alert(`Đã ghi nhận giao dịch thành công: ${randomPlan.toUpperCase()} ($${randomPlan === 'pro_yearly' ? '39.99' : randomPlan === 'pro_monthly' ? '14.99' : '4.99'}) cho ${randomEmail}!`);
}

// ==========================================
// 4. API KEYS MANAGEMENT (Gemini & Grok)
// ==========================================
async function loadApiKeys() {
  try {
    const res = await fetch('/admin/api-keys');
    const data = await res.json();
    if (!data.success) return;

    const grid = document.getElementById('api-keys-grid');
    grid.innerHTML = '';

    data.apiKeys.forEach(k => {
      const isGemini = k.provider === 'gemini';
      const isGrok = k.provider === 'grok';
      const providerLogo = isGemini ? '🔷 Google Gemini' : isGrok ? '⚡ xAI Grok' : '🤖 OpenAI';
      const providerColor = isGemini ? '#2563EB' : isGrok ? '#0F172A' : '#10B981';
      const usagePercent = Math.min(100, Math.round((k.quotaUsed / k.quotaTotal) * 100));

      grid.innerHTML += `
        <div class="api-key-card">
          <div class="key-card-header">
            <div class="key-provider-badge" style="color: ${providerColor};">
              <span>${providerLogo}</span>
            </div>
            <span class="badge ${k.status === 'active' ? 'badge-vip' : k.status === 'rate_limited' ? 'badge-trial-done' : 'badge-free'}">
              ${k.status.toUpperCase()}
            </span>
          </div>

          <div>
            <div style="font-weight: 700; font-size: 15px; color: var(--text-primary);">${k.keyName}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Model ID: <strong>${k.model}</strong></div>
          </div>

          <div class="key-code-box">
            <span>${k.apiKey.substring(0, 10)}••••••••${k.apiKey.substring(k.apiKey.length - 4)}</span>
            <button class="btn btn-secondary btn-sm" onclick="copyToClipboard('${k.apiKey}')">Sao chép</button>
          </div>

          <div class="usage-meter">
            <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: var(--text-secondary);">
              <span>Hạn ngạch tiêu thụ:</span>
              <span><strong>${k.quotaUsed.toLocaleString()}</strong> / ${k.quotaTotal.toLocaleString()} requests (${usagePercent}%)</span>
            </div>
            <div class="usage-bar-track">
              <div class="usage-bar-fill" style="width: ${usagePercent}%;"></div>
            </div>
          </div>

          <div style="font-size: 11.5px; color: var(--text-muted); line-height: 1.4;">
            📝 <em>${k.note || 'Khóa phục vụ kết nối cho ứng dụng Android.'}</em>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; border-top: 1px solid var(--border-color); padding-top: 12px;">
            <button class="btn btn-sm ${k.status === 'active' ? 'btn-secondary' : 'btn-success'}" onclick="toggleApiKey('${k.id}')">
              ${k.status === 'active' ? 'Tạm Tắt Khóa' : 'Bật Hoạt Động'}
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteApiKey('${k.id}')">Xóa</button>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error('Failed to load api keys:', err);
  }
}

function openAddKeyModal() {
  document.getElementById('modal-add-key').style.display = 'flex';
}

function autoFillModel() {
  const provider = document.getElementById('new-key-provider').value;
  const modelInput = document.getElementById('new-key-model');
  if (provider === 'gemini') modelInput.value = 'gemini-1.5-flash';
  else if (provider === 'grok') modelInput.value = 'grok-2';
  else modelInput.value = 'gpt-4o-mini';
}

async function submitAddApiKey() {
  const provider = document.getElementById('new-key-provider').value;
  const keyName = document.getElementById('new-key-name').value;
  const apiKey = document.getElementById('new-key-value').value;
  const model = document.getElementById('new-key-model').value;
  const quotaTotal = document.getElementById('new-key-quota').value;
  const note = document.getElementById('new-key-note').value;

  if (!keyName || !apiKey) {
    alert('Vui lòng nhập Tên nhãn và Mã API Key');
    return;
  }

  const res = await fetch('/admin/api-keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, keyName, apiKey, model, quotaTotal, note }),
  });
  const data = await res.json();
  if (data.success) {
    closeModal('modal-add-key');
    loadApiKeys();
  } else {
    alert(data.message || 'Lỗi khi thêm khóa');
  }
}

async function toggleApiKey(id) {
  await fetch(`/admin/api-keys/${id}/toggle`, { method: 'POST' });
  loadApiKeys();
}

async function deleteApiKey(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa API Key này không?')) return;
  await fetch(`/admin/api-keys/${id}`, { method: 'DELETE' });
  loadApiKeys();
}

// ==========================================
// 5. DEVICES MANAGEMENT (Mã Thiết Bị & Dùng Thử 1 Lần)
// ==========================================
function filterDeviceStatus(status) {
  currentDeviceFilter = status;
  document.querySelectorAll('#tab-devices .filter-pill').forEach(btn => {
    btn.classList.remove('active');
    if (btn.innerText.toLowerCase().includes(status === 'vip' ? 'vip' : status === 'free' ? 'miễn phí' : status === 'cancelled' ? 'hủy' : 'tất cả')) {
      btn.classList.add('active');
    }
  });
  loadDevices();
}

function filterDevices() {
  const term = document.getElementById('device-search-input').value.toLowerCase();
  const filtered = allDevicesCache.filter(d => 
    d.deviceId.toLowerCase().includes(term) ||
    d.country.toLowerCase().includes(term) ||
    d.platform.toLowerCase().includes(term)
  );
  renderDevicesTable(filtered);
}

async function loadDevices() {
  try {
    const res = await fetch(`/admin/devices?status=${currentDeviceFilter}`);
    const data = await res.json();
    if (!data.success) return;

    allDevicesCache = data.devices;
    renderDevicesTable(data.devices);
  } catch (err) {
    console.error('Failed to load devices:', err);
  }
}

function renderDevicesTable(devices) {
  const tbody = document.getElementById('devices-table-body');
  const mobileList = document.getElementById('devices-mobile-list');
  tbody.innerHTML = '';
  mobileList.innerHTML = '';

  devices.forEach(d => {
    const isVip = d.status === 'vip';
    const isCancelled = d.status === 'cancelled';
    const trialStatus = d.aiTrialUsed 
      ? `<span class="badge badge-trial-done">🔒 Đã dùng 1 lần (Hết hạn ngạch)</span>` 
      : `<span class="badge badge-trial-ready">✨ Còn 1 lần dùng thử</span>`;

    const statusBadge = isVip
      ? `<span class="badge badge-vip">👑 VIP Active (${d.vipPlan || 'Yearly'})</span>`
      : isCancelled
      ? `<span class="badge badge-cancelled">❌ Đã Hủy Gói</span>`
      : `<span class="badge badge-free">Free User</span>`;

      const deviceLabel = d.deviceId === 'dev_072346080be86198'
        ? `<br><span class="badge" style="background: linear-gradient(135deg, #4F46E5, #7C3AED); color: #fff; font-size: 11px; margin-top: 3px; display: inline-block;">👑 Máy Thật Chủ Tịch (Samsung Galaxy A07)</span>`
        : d.deviceId.includes('chairman')
        ? `<br><span class="badge" style="background: #0284C7; color: #fff; font-size: 11px; margin-top: 3px; display: inline-block;">⭐ Máy Test Chủ Tịch</span>`
        : '';

      tbody.innerHTML += `
        <tr>
          <td>
            <strong>${d.deviceId}</strong>
            ${deviceLabel}
            ${d.userId ? `<br><small style="color: var(--text-muted)">User: ${d.userId}</small>` : ''}
          </td>
        <td>${d.platform.toUpperCase()} (${d.osVersion})<br><small style="color: var(--text-muted)">Quốc gia: ${d.country}</small></td>
        <td><span class="badge badge-active">v${d.appVersion}</span></td>
        <td>${statusBadge}</td>
        <td>${trialStatus}</td>
        <td><strong>${d.aiUsageCount}</strong> lượt</td>
        <td>${d.installedAt}</td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-sm ${isVip ? 'btn-danger' : 'btn-success'}" onclick="toggleDeviceVip('${d.deviceId}')">
              ${isVip ? 'Hủy VIP' : 'Cấp VIP'}
            </button>
            <button class="btn btn-secondary btn-sm" onclick="resetDeviceTrial('${d.deviceId}')" title="Cấp lại 1 lượt dùng thử demo cho thiết bị">
              Reset Thử
            </button>
          </div>
        </td>
      </tr>
    `;

    // Mobile Card
    mobileList.innerHTML += `
      <div class="data-card-item">
        <div class="data-card-row">
          <span class="data-card-label">Mã Thiết Bị:</span>
          <span class="data-card-value">${d.deviceId}</span>
        </div>
        <div class="data-card-row">
          <span class="data-card-label">Trạng Thái:</span>
          <span>${statusBadge}</span>
        </div>
        <div class="data-card-row">
          <span class="data-card-label">Hạn Ngạch AI:</span>
          <span>${trialStatus}</span>
        </div>
        <div class="data-card-row">
          <span class="data-card-label">Sử Dụng AI:</span>
          <span class="data-card-value">${d.aiUsageCount} lượt</span>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px;">
          <button class="btn btn-sm ${isVip ? 'btn-danger' : 'btn-success'}" onclick="toggleDeviceVip('${d.deviceId}')">
            ${isVip ? 'Hủy VIP' : 'Cấp VIP'}
          </button>
          <button class="btn btn-secondary btn-sm" onclick="resetDeviceTrial('${d.deviceId}')">Reset Thử</button>
        </div>
      </div>
    `;
  });
}

async function toggleDeviceVip(deviceId) {
  await fetch(`/admin/devices/${deviceId}/toggle-vip`, { method: 'POST' });
  loadDevices();
  loadRevenueAnalytics();
}

async function resetDeviceTrial(deviceId) {
  const res = await fetch(`/admin/devices/${deviceId}/reset-trial`, { method: 'POST' });
  const data = await res.json();
  alert(data.message);
  loadDevices();
}

// ==========================================
// 6. REVENUE TRANSACTIONS LEDGER
// ==========================================
async function loadRevenueTransactions() {
  try {
    const res = await fetch('/admin/revenue/transactions');
    const data = await res.json();
    if (!data.success) return;

    const tbody = document.getElementById('revenue-table-body');
    tbody.innerHTML = '';

    data.transactions.forEach(r => {
      const planBadge = r.planType === 'pro_yearly' 
        ? `<span class="badge" style="background: rgba(217, 119, 6, 0.15); color: #D97706">Năm (Yearly)</span>`
        : r.planType === 'pro_monthly'
        ? `<span class="badge badge-active">Tháng (Monthly)</span>`
        : `<span class="badge badge-vip">Tuần (Weekly)</span>`;

      tbody.innerHTML += `
        <tr>
          <td><strong>${r.orderId}</strong></td>
          <td><small>${r.deviceId}</small></td>
          <td>${r.userEmail || '<span style="color: var(--text-muted)">Khách ẩn danh</span>'}</td>
          <td>${planBadge}</td>
          <td><strong style="color: var(--brand-accent)">${r.amountVnd.toLocaleString('vi-VN')} ₫</strong></td>
          <td>$${r.amountUsd.toFixed(2)}</td>
          <td><span class="badge badge-active">${r.paymentMethod}</span></td>
          <td>${r.timestamp}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error('Failed to load transactions:', err);
  }
}

function exportRevenueCsv() {
  fetch('/admin/revenue/transactions')
    .then(res => res.json())
    .then(data => {
      if (!data.success || !data.transactions.length) return alert('Không có dữ liệu giao dịch');
      let csv = 'Order ID,Device ID,Email,Plan,Amount VND,Amount USD,Payment Method,Timestamp\n';
      data.transactions.forEach(t => {
        csv += `"${t.orderId}","${t.deviceId}","${t.userEmail || ''}","${t.planType}",${t.amountVnd},${t.amountUsd},"${t.paymentMethod}","${t.timestamp}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `NextAI_Revenue_Report_${new Date().toISOString().substring(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
}

// ==========================================
// 7. USERS, MEDIA & CONVERSIONS
// ==========================================
async function loadUsers() {
  try {
    const res = await fetch('/admin/users');
    const data = await res.json();
    if (!data.success) return;

    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';
    data.users.forEach(u => {
      tbody.innerHTML += `
        <tr>
          <td><strong>${u.id}</strong></td>
          <td>${u.fullName}</td>
          <td>${u.email}</td>
          <td><span class="badge ${u.role === 'admin' ? 'badge-vip' : 'badge-active'}">${u.role.toUpperCase()}</span></td>
          <td><span class="badge ${u.status === 'active' ? 'badge-vip' : 'badge-cancelled'}">${u.status}</span></td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}')">Xóa</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error('Failed to load users:', err);
  }
}

function openAddUserModal() {
  document.getElementById('modal-add-user').style.display = 'flex';
}

async function submitAddUser() {
  const email = document.getElementById('new-user-email').value;
  const fullName = document.getElementById('new-user-fullname').value;
  const role = document.getElementById('new-user-role').value;

  if (!email || !fullName) return alert('Vui lòng nhập Email và Họ Tên');

  await fetch('/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, fullName, role }),
  });
  closeModal('modal-add-user');
  loadUsers();
}

async function deleteUser(id) {
  if (!confirm('Xóa người dùng này?')) return;
  await fetch(`/admin/users/${id}`, { method: 'DELETE' });
  loadUsers();
}

async function loadMedia() {
  try {
    const res = await fetch('/admin/media');
    const data = await res.json();
    if (!data.success) return;

    const tbody = document.getElementById('media-table-body');
    tbody.innerHTML = '';
    data.media.forEach(m => {
      tbody.innerHTML += `
        <tr>
          <td><strong>${m.id}</strong></td>
          <td>${m.filename}</td>
          <td><span class="badge badge-active">${m.contentType}</span></td>
          <td>${(m.sizeBytes / 1024 / 1024).toFixed(2)} MB</td>
          <td><a href="${m.publicUrl}" target="_blank" style="color: var(--brand-primary); font-weight: 600;">Xem File</a></td>
          <td><button class="btn btn-danger btn-sm" onclick="deleteMediaFile('${m.id}')">Xóa R2 Sync</button></td>
        </tr>
      `;
    });
  } catch (err) {
    console.error('Failed to load media:', err);
  }
}

async function deleteMediaFile(id) {
  if (!confirm('Xóa file này đồng bộ trên cả DB và Cloudflare R2?')) return;
  await fetch(`/admin/media/${id}`, { method: 'DELETE' });
  loadMedia();
}

async function loadConversions() {
  try {
    const res = await fetch('/admin/conversions');
    const data = await res.json();
    if (!data.success) return;

    const tbody = document.getElementById('conversions-table-body');
    tbody.innerHTML = '';
    data.jobs.forEach(j => {
      tbody.innerHTML += `
        <tr>
          <td><strong>${j.id}</strong></td>
          <td>${j.sourceFilename}</td>
          <td><span class="badge badge-active">${j.sourceFormat} ➔ ${j.targetFormat}</span></td>
          <td><span class="badge badge-vip">${j.status}</span></td>
          <td><a href="${j.downloadUrl || '#'}" target="_blank" style="color: var(--brand-primary); font-weight: 600;">Tải Kết Quả</a></td>
        </tr>
      `;
    });
  } catch (err) {
    console.error('Failed to load conversions:', err);
  }
}

// ==========================================
// 8. AI PERSONA & RULES CONFIGURATION (CMS)
// ==========================================
async function loadAiPersonaConfig() {
  try {
    const res = await fetch('/admin/ai-config');
    const data = await res.json();
    if (!data.success || !data.config) return;

    const c = data.config;
    document.getElementById('ai-persona-name').value = c.personaName || '';
    document.getElementById('ai-persona-updated-at').value = c.updatedAt || '';
    document.getElementById('ai-greeting-vi').value = c.greetingVi || '';
    document.getElementById('ai-greeting-en').value = c.greetingEn || '';
    document.getElementById('ai-default-reply-vi').value = c.defaultReplyVi || '';
    document.getElementById('ai-default-reply-en').value = c.defaultReplyEn || '';
    document.getElementById('ai-placeholder-vi').value = c.placeholderVi || '';
    document.getElementById('ai-placeholder-en').value = c.placeholderEn || '';
    document.getElementById('ai-quick-prompts-vi').value = (c.quickPromptsVi || []).join('\n');
    document.getElementById('ai-quick-prompts-en').value = (c.quickPromptsEn || []).join('\n');
    document.getElementById('ai-system-prompt-rules').value = c.systemPromptRules || '';
    document.getElementById('ai-auto-summary-prompt-vi').value = c.autoSummaryPromptVi || '';
    document.getElementById('ai-auto-summary-prompt-en').value = c.autoSummaryPromptEn || '';
  } catch (err) {
    console.error('Failed to load AI persona config:', err);
  }
}

async function saveAiPersonaConfig() {
  try {
    const quickPromptsVi = document.getElementById('ai-quick-prompts-vi').value
      .split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const quickPromptsEn = document.getElementById('ai-quick-prompts-en').value
      .split('\n').map(s => s.trim()).filter(s => s.length > 0);

    const payload = {
      personaName: document.getElementById('ai-persona-name').value.trim(),
      greetingVi: document.getElementById('ai-greeting-vi').value.trim(),
      greetingEn: document.getElementById('ai-greeting-en').value.trim(),
      defaultReplyVi: document.getElementById('ai-default-reply-vi').value.trim(),
      defaultReplyEn: document.getElementById('ai-default-reply-en').value.trim(),
      placeholderVi: document.getElementById('ai-placeholder-vi').value.trim(),
      placeholderEn: document.getElementById('ai-placeholder-en').value.trim(),
      quickPromptsVi,
      quickPromptsEn,
      systemPromptRules: document.getElementById('ai-system-prompt-rules').value.trim(),
      autoSummaryPromptVi: document.getElementById('ai-auto-summary-prompt-vi').value.trim(),
      autoSummaryPromptEn: document.getElementById('ai-auto-summary-prompt-en').value.trim(),
    };

    const res = await fetch('/admin/ai-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      alert('✅ Đã lưu cấu hình AI Persona, Câu chào & Khung luật thành công!\nCác thay đổi đã có hiệu lực ngay lập tức trên hệ thống.');
      if (data.config && data.config.updatedAt) {
        document.getElementById('ai-persona-updated-at').value = data.config.updatedAt;
      }
    } else {
      alert('❌ Lỗi khi lưu: ' + (data.message || 'Không xác định'));
    }
  } catch (err) {
    console.error('Error saving AI config:', err);
    alert('❌ Không thể kết nối tới server: ' + err.message);
  }
}

// Helpers
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert('Đã sao chép vào bộ nhớ tạm!');
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  // Set default dates
  const today = new Date().toISOString().substring(0, 10);
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().substring(0, 10);
  const fromInput = document.getElementById('revenue-from-date');
  const toInput = document.getElementById('revenue-to-date');
  if (fromInput) fromInput.value = firstOfMonth;
  if (toInput) toInput.value = today;

  switchTab('dashboard');
});
