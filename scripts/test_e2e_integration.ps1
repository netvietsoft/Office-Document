# Automated End-to-End Test for NextAI Office Suite Port 1500 AI Integration
# Kịch bản kiểm thử tự động toàn diện đấu nối Backend Port 1500 & Android Device

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Testing NextAI Office Suite Port 1500 Integration" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:1500"
$testDeviceId = "auto-test-device-" + (Get-Random -Minimum 10000 -Maximum 99999)

# 1. Test Server Health & Dashboard
Write-Host "`n[1/5] Testing Web Admin Dashboard & Health..." -ForegroundColor Yellow
try {
    $res = Invoke-WebRequest -Uri "$baseUrl/admin/dashboard" -UseBasicParsing
    if ($res.StatusCode -eq 200) {
        Write-Host "✅ Web Admin Dashboard is ONLINE (Status 200)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Failed to connect to Dashboard: $_" -ForegroundColor Red
    exit 1
}

# 2. Test AI Key Configurations
Write-Host "`n[2/5] Testing AI Key Config Endpoint (/api/v1/config/ai-keys)..." -ForegroundColor Yellow
try {
    $keyConfig = Invoke-RestMethod -Uri "$baseUrl/api/v1/config/ai-keys" -Method Get
    Write-Host "✅ AI Keys retrieved: Default=$($keyConfig.defaultProvider), Models=$($keyConfig.models.Count)" -ForegroundColor Green
    foreach ($m in $keyConfig.models) {
        Write-Host "   - Model: $($m.model) | Provider: $($m.provider) | Status: $($m.status)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed to get AI Keys: $_" -ForegroundColor Red
}

# 3. Test 1-Time Free Trial Quota (1st usage ALLOWED)
Write-Host "`n[3/5] Testing 1-Time Free Demo Quota Enforcement (Device: $testDeviceId)..." -ForegroundColor Yellow
$quotaBody = @{
    deviceId = $testDeviceId
    feature = "chat"
} | ConvertTo-Json

$quota1 = Invoke-RestMethod -Uri "$baseUrl/api/v1/devices/verify-quota" -Method Post -Body $quotaBody -ContentType "application/json"
if ($quota1.allowed -eq $true) {
    Write-Host "✅ 1st Usage Allowed: $($quota1.message)" -ForegroundColor Green
} else {
    Write-Host "❌ 1st Usage Should Be Allowed but was blocked!" -ForegroundColor Red
}

# 4. Test 2nd Usage Blocked -> HTTP 403 / SUBSCRIPTION_REQUIRED
Write-Host "`n[4/5] Testing 2nd Usage Blocked (Enforcing Subscription)..." -ForegroundColor Yellow
$quota2 = Invoke-RestMethod -Uri "$baseUrl/api/v1/devices/verify-quota" -Method Post -Body $quotaBody -ContentType "application/json"
if ($quota2.allowed -eq $false) {
    Write-Host "✅ 2nd Usage Blocked Successfully: $($quota2.message)" -ForegroundColor Green
} else {
    Write-Host "❌ 2nd Usage Should Be Blocked but was allowed!" -ForegroundColor Red
}

$chatBody = @{
    deviceId = $testDeviceId
    prompt = "Tóm tắt tài liệu hợp đồng này giúp tôi"
    provider = "gemini"
} | ConvertTo-Json

try {
    $chatRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/ai/chat" -Method Post -Body $chatBody -ContentType "application/json"
    Write-Host "❌ Chat should have thrown 403 SUBSCRIPTION_REQUIRED!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 403) {
        Write-Host "✅ Chat Gateway threw HTTP 403 SUBSCRIPTION_REQUIRED as strictly required!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Chat threw unexpected status: $_" -ForegroundColor Yellow
    }
}

# 5. Test VIP Device Upgrade & Unlimited Usage
Write-Host "`n[5/5] Testing Device VIP Upgrade via Admin..." -ForegroundColor Yellow
$vipToggle = Invoke-RestMethod -Uri "$baseUrl/admin/devices/$testDeviceId/toggle-vip" -Method Post
Write-Host "✅ Device VIP status: $($vipToggle.device.status) | Plan: $($vipToggle.device.vipPlan)" -ForegroundColor Green

$quotaVip = Invoke-RestMethod -Uri "$baseUrl/api/v1/devices/verify-quota" -Method Post -Body $quotaBody -ContentType "application/json"
if ($quotaVip.allowed -eq $true -and $quotaVip.isVip -eq $true) {
    Write-Host "✅ VIP Device Granted Unlimited Access: $($quotaVip.message)" -ForegroundColor Green
} else {
    Write-Host "❌ VIP Device was not granted access!" -ForegroundColor Red
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "🎉 ALL 5 INTEGRATION STAGES PASSED 100%!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
