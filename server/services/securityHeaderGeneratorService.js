/**
 * XELOVO Security Header Configuration Generator Service
 * Produces hardened, production-ready server and application security configurations.
 */

function generateSecurityHeaderConfigs(targetDomain = 'example.com', options = {}) {
  const domain = (targetDomain || 'example.com').trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
  const isStrict = options.strict !== false;

  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ');

  const headers = {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Content-Security-Policy': cspDirectives,
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin'
  };

  const nginx = `# ====================================================================
# XELOVO Hardened Security Headers for Nginx
# Target: ${domain}
# Generated: ${new Date().toISOString()}
# ====================================================================

# HTTP Strict Transport Security (HSTS)
add_header Strict-Transport-Security "${headers['Strict-Transport-Security']}" always;

# Content Security Policy (CSP)
add_header Content-Security-Policy "${headers['Content-Security-Policy']}" always;

# Clickjacking Protection
add_header X-Frame-Options "${headers['X-Frame-Options']}" always;

# MIME-Type Sniffing Prevention
add_header X-Content-Type-Options "${headers['X-Content-Type-Options']}" always;

# Referrer Information Leakage Prevention
add_header Referrer-Policy "${headers['Referrer-Policy']}" always;

# Browser Feature and Hardware Permissions Policy
add_header Permissions-Policy "${headers['Permissions-Policy']}" always;

# Cross-Origin Process Isolation (Spectre mitigation)
add_header Cross-Origin-Opener-Policy "${headers['Cross-Origin-Opener-Policy']}" always;
add_header Cross-Origin-Resource-Policy "${headers['Cross-Origin-Resource-Policy']}" always;

# Suppress Nginx Version Disclosure
server_tokens off;
`;

  const apache = `# ====================================================================
# XELOVO Hardened Security Headers for Apache (.htaccess or httpd.conf)
# Target: ${domain}
# Generated: ${new Date().toISOString()}
# ====================================================================

<IfModule mod_headers.c>
  # HTTP Strict Transport Security (HSTS)
  Header always set Strict-Transport-Security "${headers['Strict-Transport-Security']}"

  # Content Security Policy (CSP)
  Header always set Content-Security-Policy "${headers['Content-Security-Policy']}"

  # Clickjacking Protection
  Header always set X-Frame-Options "${headers['X-Frame-Options']}"

  # MIME-Type Sniffing Prevention
  Header always set X-Content-Type-Options "${headers['X-Content-Type-Options']}"

  # Referrer Information Leakage Prevention
  Header always set Referrer-Policy "${headers['Referrer-Policy']}"

  # Browser Feature & Hardware Permissions Policy
  Header always set Permissions-Policy "${headers['Permissions-Policy']}"

  # Cross-Origin Isolation
  Header always set Cross-Origin-Opener-Policy "${headers['Cross-Origin-Opener-Policy']}"
  Header always set Cross-Origin-Resource-Policy "${headers['Cross-Origin-Resource-Policy']}"
</IfModule>

# Suppress Server Information Disclosure
ServerSignature Off
`;

  const express = `// ====================================================================
// XELOVO Hardened Express.js Middleware (using helmet)
// Target: ${domain}
// Generated: ${new Date().toISOString()}
// Install: npm install helmet
// ====================================================================

const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  hidePoweredBy: true
}));
`;

  const nextjs = `// ====================================================================
// XELOVO Hardened next.config.js Headers Configuration
// Target: ${domain}
// Generated: ${new Date().toISOString()}
// ====================================================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: '${headers['Strict-Transport-Security']}'
          },
          {
            key: 'Content-Security-Policy',
            value: "${headers['Content-Security-Policy']}"
          },
          {
            key: 'X-Frame-Options',
            value: '${headers['X-Frame-Options']}'
          },
          {
            key: 'X-Content-Type-Options',
            value: '${headers['X-Content-Type-Options']}'
          },
          {
            key: 'Referrer-Policy',
            value: '${headers['Referrer-Policy']}'
          },
          {
            key: 'Permissions-Policy',
            value: '${headers['Permissions-Policy']}'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: '${headers['Cross-Origin-Opener-Policy']}'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: '${headers['Cross-Origin-Resource-Policy']}'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
`;

  return {
    domain,
    timestamp: new Date().toISOString(),
    headers,
    configs: {
      nginx,
      apache,
      express,
      nextjs
    }
  };
}

module.exports = { generateSecurityHeaderConfigs };
