const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:1500${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

function post(path, body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const req = http.request(`http://localhost:1500${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('=== TEST 1: ADMIN STATS ===');
  const stats = await get('/admin/stats');
  console.log('Stats:', stats.status, stats.body.stats);

  console.log('\n=== TEST 2: API KEYS ===');
  const keys = await get('/admin/api-keys');
  console.log('Keys count:', keys.body.apiKeys.length);
  keys.body.apiKeys.forEach(k => console.log(` - [${k.provider.toUpperCase()}] ${k.keyName} (${k.model}) - Status: ${k.status}`));

  console.log('\n=== TEST 3: DEVICE ID QUOTA (1 TIME ONLY) ===');
  const testDevId = 'dev-samsung-chairman-test-' + Date.now();
  const q1 = await post('/api/v1/devices/verify-quota', { deviceId: testDevId, feature: 'chat' });
  console.log('1st Request (Should ALLOW):', q1.body);

  const q2 = await post('/api/v1/devices/verify-quota', { deviceId: testDevId, feature: 'summarize' });
  console.log('2nd Request (Should BLOCK):', q2.body);

  console.log('\n=== TEST 4: REVENUE ANALYTICS (MONTH) ===');
  const rev = await get('/admin/revenue/analytics?period=month');
  console.log('Summary:', rev.body.analytics.summary);
  console.log('Plan Breakdown:', rev.body.analytics.planBreakdown);
  console.log('Timeline points:', rev.body.analytics.timeline.length);

  console.log('\n=== TEST 5: CMS HTML PAGE ===');
  const html = await get('/admin/dashboard');
  console.log('Dashboard HTML Status:', html.status, 'Length:', html.body.length);
}

run().catch(console.error);
