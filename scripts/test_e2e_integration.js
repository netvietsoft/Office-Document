/**
 * NextAI Office Suite - End-to-End Integration Test Suite (Port 1500)
 * Kiểm Thử Tự Động Toàn Diện Kết Nối Backend Port 1500 & Kiểm Soát Quota Thiết Bị
 */

const http = require('http');

const BASE_URL = 'http://localhost:1500';
const testDeviceId = 'device-integration-' + Math.floor(Math.random() * 90000 + 10000);

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ statusCode: res.statusCode, headers: res.headers, data: json });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('==========================================================');
  console.log('🚀 NextAI Office Suite - Testing Backend Port 1500 Integration');
  console.log('   Device ID Test: ' + testDeviceId);
  console.log('==========================================================\n');

  // Stage 1: Health & Dashboard
  console.log('[1/5] Checking Dashboard & Server Health...');
  const healthRes = await request({
    hostname: 'localhost',
    port: 1500,
    path: '/admin/dashboard',
    method: 'GET',
  });
  if (healthRes.statusCode === 200) {
    console.log('✅ Dashboard is ONLINE (Status 200)');
  } else {
    throw new Error('Dashboard returned ' + healthRes.statusCode);
  }

  // Stage 2: AI Key Config
  console.log('\n[2/5] Checking AI Key Config (/api/v1/config/ai-keys)...');
  const keyRes = await request({
    hostname: 'localhost',
    port: 1500,
    path: '/api/v1/config/ai-keys',
    method: 'GET',
  });
  console.log(`✅ Models available: ${keyRes.data.models.length}, Default: ${keyRes.data.defaultProvider}`);
  keyRes.data.models.forEach((m) => {
    console.log(`   - Model: ${m.model} | Provider: ${m.provider} | Status: ${m.status}`);
  });

  // Stage 3: 1st Trial Quota (Approved)
  console.log('\n[3/5] Testing 1-Time Free Demo Quota (1st Call)...');
  const trial1 = await request(
    {
      hostname: 'localhost',
      port: 1500,
      path: '/api/v1/devices/verify-quota',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { deviceId: testDeviceId, feature: 'chat' }
  );
  if (trial1.data.allowed === true && trial1.data.isVip === false) {
    console.log(`✅ 1st Usage ALLOWED: ${trial1.data.message}`);
  } else {
    throw new Error('1st usage should be allowed! Got: ' + JSON.stringify(trial1.data));
  }

  // Stage 4: 2nd Trial Quota (BLOCKED -> Require Subscription)
  console.log('\n[4/5] Testing 2nd Call (Enforcing VIP Subscription)...');
  const trial2 = await request(
    {
      hostname: 'localhost',
      port: 1500,
      path: '/api/v1/devices/verify-quota',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { deviceId: testDeviceId, feature: 'chat' }
  );
  if (trial2.data.allowed === false && trial2.data.isVip === false) {
    console.log(`✅ 2nd Usage BLOCKED: ${trial2.data.message}`);
  } else {
    throw new Error('2nd usage should be blocked! Got: ' + JSON.stringify(trial2.data));
  }

  // Stage 4b: Chat Gateway Throws 403 SUBSCRIPTION_REQUIRED
  console.log('   Testing Chat Gateway block with 403 SUBSCRIPTION_REQUIRED...');
  const chatRes = await request(
    {
      hostname: 'localhost',
      port: 1500,
      path: '/api/v1/ai/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { deviceId: testDeviceId, prompt: 'Hello AI', provider: 'gemini' }
  );
  if (chatRes.statusCode === 403 && chatRes.data.code === 'SUBSCRIPTION_REQUIRED') {
    console.log(`✅ Chat Gateway correctly returned HTTP 403 SUBSCRIPTION_REQUIRED!`);
  } else {
    throw new Error('Chat should return 403 SUBSCRIPTION_REQUIRED! Got: ' + chatRes.statusCode);
  }

  // Stage 5: Upgrade Device to VIP via CMS Admin
  console.log('\n[5/5] Testing Device VIP Upgrade via Web CMS Admin...');
  const upgradeRes = await request({
    hostname: 'localhost',
    port: 1500,
    path: `/admin/devices/${testDeviceId}/toggle-vip`,
    method: 'POST',
  });
  console.log(`✅ Device status updated: ${upgradeRes.data.device.status}, Plan: ${upgradeRes.data.device.vipPlan}`);

  // Test VIP Device Quota Verification
  const vipQuota = await request(
    {
      hostname: 'localhost',
      port: 1500,
      path: '/api/v1/devices/verify-quota',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { deviceId: testDeviceId, feature: 'chat' }
  );
  if (vipQuota.data.allowed === true && vipQuota.data.isVip === true) {
    console.log(`✅ VIP Device Granted Unlimited Access: ${vipQuota.data.message}`);
  } else {
    throw new Error('VIP Device should have unlimited access! Got: ' + JSON.stringify(vipQuota.data));
  }

  console.log('\n==========================================================');
  console.log('🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
  console.log('==========================================================\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
