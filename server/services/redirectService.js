const http = require('http');
const https = require('https');
const { URL } = require('url');

async function traceRedirects(inputUrl, maxHops = 10) {
  let currentUrl = inputUrl.trim();
  if (!/^https?:\/\//i.test(currentUrl)) {
    currentUrl = `https://${currentUrl}`;
  }

  const hops = [];
  const visited = new Set();
  let finalDestination = currentUrl;
  let status = 'completed';

  for (let step = 0; step < maxHops; step++) {
    if (visited.has(currentUrl)) {
      hops.push({
        step: step + 1,
        url: currentUrl,
        statusCode: null,
        error: 'Redirect Loop Detected'
      });
      status = 'redirect_loop';
      break;
    }
    visited.add(currentUrl);

    let stepInfo;
    try {
      stepInfo = await fetchSingleHop(currentUrl);
    } catch (err) {
      hops.push({
        step: step + 1,
        url: currentUrl,
        statusCode: null,
        error: err.message
      });
      break;
    }

    hops.push({
      step: step + 1,
      url: currentUrl,
      statusCode: stepInfo.statusCode,
      statusMessage: stepInfo.statusMessage,
      headers: {
        location: stepInfo.location || null,
        server: stepInfo.server || null
      },
      https: currentUrl.startsWith('https://')
    });

    if (stepInfo.location && [301, 302, 303, 307, 308].includes(stepInfo.statusCode)) {
      let resolvedNext;
      try {
        resolvedNext = new URL(stepInfo.location, currentUrl).href;
      } catch (e) {
        resolvedNext = stepInfo.location;
      }
      currentUrl = resolvedNext;
      finalDestination = currentUrl;
    } else {
      // Reached final destination
      finalDestination = currentUrl;
      break;
    }
  }

  // Analyze redirect path risk
  let hasHttpsDowngrade = false;
  let domainChanges = 0;
  let initialHost = '';
  try { initialHost = new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`).hostname; } catch(e){}

  for (let i = 0; i < hops.length - 1; i++) {
    if (hops[i].https && !hops[i+1].https) {
      hasHttpsDowngrade = true;
    }
    try {
      const h1 = new URL(hops[i].url).hostname;
      const h2 = new URL(hops[i+1].url).hostname;
      if (h1 !== h2) domainChanges++;
    } catch(e){}
  }

  return {
    origin: inputUrl,
    finalDestination,
    totalHops: hops.length,
    status,
    hops,
    riskIndicators: {
      hasHttpsDowngrade,
      domainChanges,
      excessiveRedirects: hops.length > 4,
      potentialOpenRedirect: domainChanges > 1
    },
    timestamp: new Date().toISOString()
  };
}

function fetchSingleHop(targetUrl) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const client = parsed.protocol === 'https:' ? https : http;

    const req = client.request(targetUrl, { method: 'HEAD', timeout: 5000 }, (res) => {
      resolve({
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        location: res.headers['location'],
        server: res.headers['server']
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Hop connection timeout (5000ms)'));
    });
    req.end();
  });
}

module.exports = { traceRedirects };
