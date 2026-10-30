const http = require('http');
const https = require('https');
const { URL } = require('url');

async function analyzeSecurityHeaders(inputUrl) {
  let target = inputUrl.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = `https://${target}`;
  }

  const parsed = new URL(target);
  const client = parsed.protocol === 'https:' ? https : http;

  return new Promise((resolve) => {
    const req = client.request(target, { method: 'HEAD', timeout: 7000 }, (res) => {
      const headers = res.headers;
      
      const headerMap = {
        'strict-transport-security': {
          name: 'Strict-Transport-Security (HSTS)',
          present: !!headers['strict-transport-security'],
          value: headers['strict-transport-security'] || null,
          importance: 'High',
          description: 'Enforces HTTPS connections and prevents SSL stripping attacks.',
          recommendation: 'Add Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'
        },
        'content-security-policy': {
          name: 'Content-Security-Policy (CSP)',
          present: !!headers['content-security-policy'],
          value: headers['content-security-policy'] || null,
          importance: 'Critical',
          description: 'Restricts resources (scripts, images, frames) loaded by browser to mitigate XSS.',
          recommendation: "Define default-src 'self'; script-src 'self' trusted-cdn.com;"
        },
        'x-frame-options': {
          name: 'X-Frame-Options',
          present: !!headers['x-frame-options'],
          value: headers['x-frame-options'] || null,
          importance: 'High',
          description: 'Prevents Clickjacking attacks by disabling page embedding in <frame> or <iframe>.',
          recommendation: 'Set X-Frame-Options: DENY or SAMEORIGIN'
        },
        'x-content-type-options': {
          name: 'X-Content-Type-Options',
          present: !!headers['x-content-type-options'],
          value: headers['x-content-type-options'] || null,
          importance: 'Medium',
          description: 'Prevents MIME-type sniffing.',
          recommendation: 'Set X-Content-Type-Options: nosniff'
        },
        'referrer-policy': {
          name: 'Referrer-Policy',
          present: !!headers['referrer-policy'],
          value: headers['referrer-policy'] || null,
          importance: 'Medium',
          description: 'Controls referrer information sent in HTTP headers when navigating away.',
          recommendation: 'Set Referrer-Policy: strict-origin-when-cross-origin'
        },
        'permissions-policy': {
          name: 'Permissions-Policy',
          present: !!headers['permissions-policy'],
          value: headers['permissions-policy'] || null,
          importance: 'Medium',
          description: 'Restricts access to browser features like camera, microphone, geolocation.',
          recommendation: 'Set Permissions-Policy: camera=(), microphone=(), geolocation=()'
        },
        'x-xss-protection': {
          name: 'X-XSS-Protection',
          present: !!headers['x-xss-protection'],
          value: headers['x-xss-protection'] || null,
          importance: 'Low',
          description: 'Legacy filter for cross-site scripting.',
          recommendation: 'Set X-XSS-Protection: 0 or rely on modern CSP.'
        }
      };

      // Server info disclosure checks
      const serverHeader = headers['server'] || null;
      const poweredByHeader = headers['x-powered-by'] || null;

      let presentCount = 0;
      let totalChecked = Object.keys(headerMap).length;
      Object.values(headerMap).forEach(h => {
        if (h.present) presentCount++;
      });

      let score = Math.round((presentCount / totalChecked) * 100);
      let grade = 'F';
      if (score >= 85) grade = 'A+';
      else if (score >= 70) grade = 'A';
      else if (score >= 50) grade = 'B';
      else if (score >= 35) grade = 'C';
      else if (score >= 20) grade = 'D';

      resolve({
        target,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString(),
        score,
        grade,
        headersEvaluated: headerMap,
        rawHeaders: headers,
        serverFingerprint: {
          server: serverHeader,
          poweredBy: poweredByHeader,
          disclosesVersion: !!(serverHeader && /\d+\.\d+/.test(serverHeader)) || !!poweredByHeader
        },
        summary: {
          present: presentCount,
          missing: totalChecked - presentCount,
          total: totalChecked
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        target,
        error: `Header inspection failed: ${err.message}`,
        timestamp: new Date().toISOString()
      });
    });

    req.setTimeout(7000, () => {
      req.destroy();
      resolve({
        target,
        error: 'Connection timeout inspecting HTTP headers.',
        timestamp: new Date().toISOString()
      });
    });

    req.end();
  });
}

module.exports = {
  analyzeSecurityHeaders,
  inspectHeaders: analyzeSecurityHeaders
};
