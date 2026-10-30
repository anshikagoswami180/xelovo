# XELOVO Production Deployment & Operations Guide

**Platform:** XELOVO Defensive Cybersecurity & Digital Investigation Platform  
**Target Environment:** Linux / Unix (Ubuntu 22.04 / 24.04 LTS, Debian 12, RHEL 9) or Windows Server  
**Architecture:** Unified Node.js Engine (Express 5.1.0) + React/Vite Client + Better-SQLite3 (WAL Mode)  
**Authors & Leads:** Anshika Goswami (Founder & Project Lead), Dhruvi Solanki (Technical Lead & Frontend Developer)  
**Technical Identity:** PXT sec26-27 | Government Polytechnic Valsad, Information Technology Department  

---

## 1. System Architecture Overview

```
                      [ Internet / End Users ]
                                 │
                                 ▼
                     [ Nginx Reverse Proxy ]
               (TLS 1.3 Termination + OWASP Headers)
                                 │
               ┌─────────────────┴─────────────────┐
               ▼                                   ▼
    [ Static Client Assets ]              [ XELOVO Core API ]
     (client/dist bundle)                 (http://127.0.0.1:5000)
                                                   │
                                      ┌────────────┴────────────┐
                                      ▼                         ▼
                            [ SQLite Database ]        [ Probing Sockets ]
                            (server/data/xelavo.db)    (DNS, TLS, HTTP)
```

In production, XELOVO can be deployed either:
1. **Unified Mode (Recommended):** The Node.js Express server directly serves both the compiled Vite frontend (`client/dist`) and all `/api/*` routes on a single port (default `5000`), proxied by Nginx.
2. **Split Mode:** Nginx directly serves `client/dist` static assets and reverse-proxies `/api/` to the Node.js backend.

---

## 2. Environment Configuration

Create a `.env` file in the root directory:

```ini
# ====================================================================
# XELOVO Production Environment Configuration
# ====================================================================

NODE_ENV=production
PORT=5000

# Cryptographic Session & JWT Secret (Generate with: openssl rand -hex 32)
JWT_SECRET=c8f5d629a4358e77a11974bb7c2decf76f709191d4e0e5a8f4c27a908f5d6e21

# Optional External Intelligence API Keys
# (Leave blank to operate in Honest Zero-Fabrication local probe mode)
VIRUSTOTAL_API_KEY=
SHODAN_API_KEY=
ABUSEIPDB_API_KEY=
```

---

## 3. Build & Installation Steps

### Step 1: Clone Repository & Install Dependencies
```bash
git clone https://github.com/anshikagoswami180/xelovo.git
cd xelovo

# Install root dependencies
npm ci --omit=dev

# Install client dependencies & build static distribution
cd client
npm ci
npm run build
cd ..
```

### Step 2: Verify Build Output
Ensure `client/dist/` exists and contains `index.html` and bundled assets in `client/dist/assets/`.

### Step 3: Run Automated Verification Tests
```bash
npm test
```
Confirm all 26 automated tests pass before running production service.

---

## 4. Process Management (PM2)

Using [PM2](https://pm2.keymetrics.io/) ensures process auto-restart on crashes or server reboots.

### Install PM2
```bash
npm install -g pm2
```

### PM2 Ecosystem File (`ecosystem.config.js`)
Create `ecosystem.config.js` in the project root:
```javascript
module.exports = {
  apps: [{
    name: 'xelovo-core',
    script: 'server/index.js',
    instances: 1, // Single instance preserves in-memory rate-limiter and SQLite WAL lock safety
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

### Start & Persist PM2 Process
```bash
# Start service
pm2 start ecosystem.config.js

# Save process list
pm2 save

# Setup system boot startup script
pm2 startup
```

---

## 5. Nginx Production Configuration

Save the following configuration to `/etc/nginx/sites-available/xelovo.conf`:

```nginx
# ====================================================================
# XELOVO Official Nginx Production Server Configuration
# ====================================================================

# HTTP Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name xelovo.io www.xelovo.io;

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS Server Block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name xelovo.io www.xelovo.io;

    # SSL Certificates (e.g. Let's Encrypt Certbot)
    ssl_certificate /etc/letsencrypt/live/xelovo.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/xelovo.io/privkey.pem;

    # TLS Protocols & Ciphers (Modern TLS 1.3 / 1.2 baseline)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;

    # OWASP Recommended Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
    add_header Cross-Origin-Opener-Policy "same-origin" always;

    # Disable Server Software Version Disclosure
    server_tokens off;

    # Client Request Size Restrictions
    client_max_body_size 15M;

    # Proxy to Node.js Core API & Client Bundles
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        proxy_connect_timeout 15s;
        proxy_read_timeout 60s;
    }
}
```

Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/xelovo.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. Database Maintenance & Backup (SQLite WAL)

XELOVO uses `better-sqlite3` configured with **Write-Ahead Logging (`PRAGMA journal_mode = WAL`)**.

### Advantages of WAL Mode
- High concurrency: readers do not block writers, and writers do not block readers.
- Minimal disk I/O latency.

### Safe Live Database Backup
To backup the SQLite database without stopping the server:
```bash
# Using sqlite3 online backup command
sqlite3 server/data/xelavo.db ".backup 'server/data/backups/xelovo-$(date +%Y%m%d_%H%M%S).db'"
```

Set up a daily cron job for backups:
```bash
crontab -e
# Add line:
0 3 * * * sqlite3 /var/www/xelovo/server/data/xelavo.db ".backup '/var/backups/xelovo-$(date +\%Y\%m\%d).db'"
```

---

## 7. Health Checks & Monitoring

The backend exposes an automated health endpoint:
```bash
curl -I http://127.0.0.1:5000/api/health
```
**Expected HTTP 200 Response:**
```json
{
  "status": "XELOVO Core Engine Online",
  "brand": "XELOVO",
  "tagline": "See Threats. Know More. Stay Protected.",
  "version": "1.0.0-Phase1+2",
  "timestamp": "2026-10-26T18:00:00.000Z"
}
```

---

## 8. Pre-Flight Security Checklist

Before taking the production deployment live:
- [x] Node environment is set to `NODE_ENV=production`.
- [x] High-entropy `JWT_SECRET` generated and loaded via environment variables.
- [x] Server software identification headers disabled (`app.disable('x-powered-by')` and `server_tokens off`).
- [x] SSRF Guard active and verified (`npm test` passes all SSRF boundary checks).
- [x] Rate limiting middleware mounted on `/api/` (150 req/min) and `/api/scans/execute` (40 req/min).
- [x] Passwords hashed using `bcryptjs` with salt rounds.
- [x] SSL/TLS certificate installed and Grade A+ rated on SSL Labs.
- [x] All 26 automated tests pass with 0 defects.
