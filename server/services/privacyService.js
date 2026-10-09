const http = require('http');
const https = require('https');
const { URL } = require('url');

async function analyzePrivacy(inputUrl) {
  let target = inputUrl.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = `https://${target}`;
  }

  return new Promise((resolve) => {
    const parsed = new URL(target);
    const client = parsed.protocol === 'https:' ? https : http;

    const req = client.get(target, { timeout: 8000 }, (res) => {
      let body = '';
      res.on('data', chunk => {
        if (body.length < 500000) body += chunk; // Read first 500KB
      });

      res.on('end', () => {
        const headers = res.headers;

        // Known third-party analytics & tracking domains
        const knownTrackers = [
          { name: 'Google Analytics', pattern: /google-analytics\.com|googletagmanager\.com|gtag/i },
          { name: 'Meta Pixel', pattern: /connect\.facebook\.net|fbevents\.js/i },
          { name: 'Hotjar Session Recording', pattern: /static\.hotjar\.com|hotjar/i },
          { name: 'Mixpanel Analytics', pattern: /cdn\.mxpnl\.com|mixpanel/i },
          { name: 'HubSpot Tracking', pattern: /js\.hs-scripts\.com|hubspot/i },
          { name: 'TikTok Pixel', pattern: /analytics\.tiktok\.com/i },
          { name: 'LinkedIn Insight Tag', pattern: /snap\.licdn\.com/i },
          { name: 'Clarity Session Replay', pattern: /clarity\.ms/i }
        ];

        const detectedTrackers = knownTrackers.filter(t => t.pattern.test(body)).map(t => t.name);

        // Check for Privacy Policy link
        const hasPrivacyPolicyLink = /privacy[-_]?policy|privacy\.html|privacy\.php/i.test(body) || /privacy/i.test(body);

        // Cookie headers
        const setCookieHeaders = headers['set-cookie'] || [];
        const cookieCount = setCookieHeaders.length;

        // Privacy Score Calculation
        let penalty = detectedTrackers.length * 12 + cookieCount * 5 + (!hasPrivacyPolicyLink ? 20 : 0);
        let score = Math.max(10, 100 - penalty);

        resolve({
          target,
          timestamp: new Date().toISOString(),
          privacyScore: score,
          rating: score >= 80 ? 'Excellent Privacy Protection' : score >= 60 ? 'Moderate Privacy Exposure' : 'High Privacy Risk',
          privacyPolicyFound: hasPrivacyPolicyLink,
          detectedTrackers,
          totalTrackersFound: detectedTrackers.length,
          cookiesSetOnLanding: cookieCount,
          rawCookies: setCookieHeaders.map(c => c.split(';')[0]),
          recommendations: [
            !hasPrivacyPolicyLink ? 'Add an explicit link to your Privacy Policy on the homepage footer.' : null,
            detectedTrackers.length > 3 ? 'Minimize third-party tracking scripts to respect user privacy and improve LCP.' : null,
            cookieCount > 5 ? 'Audit and reduce non-essential tracking cookies.' : null
          ].filter(Boolean)
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        target,
        error: `Privacy scan failed: ${err.message}`,
        timestamp: new Date().toISOString()
      });
    });

    req.setTimeout(8000, () => {
      req.destroy();
      resolve({
        target,
        error: 'Privacy scan timed out connecting to host.',
        timestamp: new Date().toISOString()
      });
    });
  });
}

module.exports = { analyzePrivacy };
