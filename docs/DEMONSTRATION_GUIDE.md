# XELOVO Live Demonstration & Evaluation Guide

**Platform:** XELOVO Cybersecurity & Threat Intelligence Platform  
**Authors & Leads:** Anshika Goswami (Founder & Project Lead), Dhruvi Solanki (Technical Lead & Frontend Developer)  
**Academic Identity:** PXT sec26-27 | Government Polytechnic Valsad, Information Technology Department, Semester 5, Group 15  
**Document Purpose:** Step-by-step reproducible walkthrough for academic evaluators, technical reviewers, and security analysts.  

---

## 1. Quickstart (Under 2 Minutes)

### Prerequisites
- Node.js 18+ (tested on Node v20/v22)
- Git & modern web browser (Chrome, Edge, Firefox, Safari)

### Starting the Platform
From the project root:
```bash
# 1. Install dependencies (if not already installed)
npm install
npm --prefix client install

# 2. Build production assets
npm run build

# 3. Start unified server
npm start
```
The unified platform runs at: **`http://localhost:5000`**  
(Or run `npm run dev` to launch the Vite HMR development server on `http://localhost:5173` alongside the backend).

---

## 2. Safe Demonstration Target Policy

All demonstration walkthroughs below use **explicitly safe, authorized test inputs**:
- **Domain Tools:** `example.com` (IANA reserved test domain)
- **URL Tools:** `https://example.com`
- **Password Workstation:** `P@ssw0rd!Secure#2026` (100% in-browser Shannon entropy calculation)
- **Scam / Phishing Workstations:** Clearly labeled `[DEMONSTRATION DATA]` test fixtures.

> **Zero Fabrication Guarantee:** XELOVO executes real, live network socket probes (DNS, TLS, HTTP) against the targets you supply. When third-party API keys (e.g., VirusTotal or darknet feeds) are unconfigured, XELOVO transparently declares their unconfigured status rather than generating synthetic metrics.

---

## 3. Flagship Workstation Demonstrations

### Demonstration 1: Attack Surface Exposure Map
- **URL:** Navigate to `/tools/exposure-map`
- **Input:** Click **"Load Safe Demo Target"** (populates `example.com`)
- **Authorization Checkbox:** Checked automatically
- **Action:** Click **"Run Analysis"**
- **Observed Behavior:**
  - Real-time DNS probes query A, AAAA, MX, TXT, NS records.
  - Generates an interactive **Constellation Graph** showing the target domain node connected via relational vectors (`resolves_to`, `mail_handler`) to public IP endpoints and mail gateways.
  - Displays evidence with verified provenance, categorized findings, and confidence ratings.

### Demonstration 2: Link DNA Structural Analyzer
- **URL:** Navigate to `/tools/link-dna`
- **Input:** Click **"Load Safe Demo Target"** (populates `https://example.com`) or enter any test URL (e.g. `https://login.verify-update-bank.com.xyz/session`)
- **Action:** Click **"Run Analysis"**
- **Observed Behavior:**
  - Decomposes the URL into structural identity attributes: scheme, hostname, TLD, subdomain count, and query parameters.
  - Flags suspicious TLDs (`.xyz`, `.top`, `.zip`), excessive subdomain depth, homograph characters, and credential-harvesting tokens.
  - Computes a Deception Risk Score and categorizes threats according to OWASP guidelines.

### Demonstration 3: Shadow Attack Surface Stack
- **URL:** Navigate to `/tools/shadow-surface`
- **Input:** Click **"Load Safe Demo Target"** (`example.com`)
- **Authorization Checkbox:** Must be checked (enforces ethical scanning boundaries)
- **Action:** Click **"Run Analysis"**
- **Observed Behavior:**
  - Evaluates 5 defensive architecture layers:
    1. **Identity Layer:** Domain registration indicators, nameservers, SOA.
    2. **Domain Layer:** Active subdomains, MX records, SPF/DMARC posture.
    3. **Network Layer:** Open public IPv4/IPv6 endpoints, CDN presence.
    4. **Web Application Layer:** Security response headers, server software disclosure.
    5. **Storage & Exposure Layer:** Sensitive cookie flags and tracking script posture.
  - Highlights misconfigurations and calculates cumulative layer exposure metrics.

### Demonstration 4: Signal Zero Threat Timeline
- **URL:** Navigate to `/tools/signal-zero`
- **Input:** Click **"Load Safe Demo Target"** (`example.com`)
- **Action:** Click **"Run Analysis"**
- **Observed Behavior:**
  - Correlates multi-tool telemetry into a single chronological threat timeline.
  - Highlights security signals: e.g., Missing DMARC record, Server version disclosure, and TLS certificate expiration countdown.

---

## 4. Specialized Utility Workstations

### Demonstration 5: Security Header Generator & Inspector
1. **Inspector (`/tools/header-inspector`):**
   - Enter `https://example.com` $\rightarrow$ Evaluates HSTS, CSP, X-Frame-Options, Permissions-Policy, and Referrer-Policy with letter grades (A+ to F).
2. **Generator (`/tools/security-header-generator`):**
   - Click **"Load Safe Demo Target"** (`example.com`).
   - Select platform: **Nginx**, **Apache**, **Express.js (Helmet)**, or **Next.js**.
   - Click **"Run Analysis"**.
   - View the formatted, syntax-highlighted configuration snippet with a one-click **"Copy Config"** button.

### Demonstration 6: Password Entropy Analyzer (100% Local Privacy)
- **URL:** Navigate to `/tools/password-analyzer`
- **Input:** Type any test passphrase (e.g. `P@ssw0rd!Secure#2026`)
- **Action:** Click **"Run Analysis"**
- **Observed Behavior:**
  - Computes exact Shannon entropy (bits), character pool size (upper, lower, digit, symbol diversity), and estimated brute-force resistance.
  - **Privacy Proof:** Network tab confirms zero HTTP requests; computation executes completely in client memory.

### Demonstration 7: Scam Protection & Phishing Analyzers
- **Scam Analyzer (`/scam-analyzer`):**
  - Click **"Load Synthetic High-Risk Test Suite"**.
  - Analyzes high-pressure phrases, advance-fee fraud patterns, and fake support claims.
- **Phishing Analyzer (`/phishing-analyzer`):**
  - Click **"Load Sample Phishing Telemetry"**.
  - Evaluates sender alignment, urgency cues, and lookalike domain patterns.

---

## 5. Enterprise Database Persistence & Audit Logging Demonstrations

XELOVO features a transactional SQLite database engine (`better-sqlite3`) operating in WAL mode with strict foreign-key enforcement, versioned SQL migrations, and centralized security audit logging.

### Database Capabilities & Verification

| Capability | Architecture / Mechanism | Expected Verification Behavior |
| :--- | :--- | :--- |
| **Connection & Health Check** | Native `db.checkHealth()` exposed at `/api/health` | Returns status `HEALTHY` with database file path, active WAL journal mode, and applied migration count. |
| **Versioned Migrations** | `server/migrate.js` + `server/migrations/*.sql` | Automatically applies pending SQL migrations in isolated transactions, recording execution timestamps in `_migrations`. |
| **Foreign-Key Integrity** | `PRAGMA foreign_keys = ON;` | Strict referential integrity: attempts to insert orphaned scans without a parent user row are immediately rejected. |
| **Transactional Atomicity** | `runInTransaction(callback)` | Atomic operations rollback completely upon any unhandled exception, leaving database state uncorrupted. |
| **Multi-Tenant Record Isolation** | Parameterized `WHERE user_id = ?` scoping | Cross-tenant data isolation ensures queries respect user security boundaries and prevent data leakage. |
| **Centralized Audit Logging** | `server/services/auditService.js` | Critical security operations (scans, report exports, configuration generation) are immutably logged to `audit_logs`. |

---

## 6. Report Generation & Export

1. Complete any tool scan or investigation.
2. Navigate to **Investigations & Reports** (`/reports`).
3. Click **"Generate Security Report"** or select a saved investigation.
4. Export options:
   - **Markdown Report (`.md`):** Formatted for technical documentation and Git commits.
   - **JSON Telemetry (`.json`):** Machine-readable structured payload containing `analysisId`, `reportHash`, evidence arrays, and limitations.

---

## 7. Troubleshooting & FAQ

- **Q: Why does breach check show "UNAVAILABLE"?**  
  *A:* XELOVO adheres to a strict Zero Fabrication Policy. When commercial external breach API keys (e.g., HaveIBeenPwned) are not configured, the platform transparently reports the API as unconfigured rather than inventing fake compromised records.
- **Q: Can I scan internal IPs?**  
  *A:* No. XELOVO's SSRF Guard structurally rejects RFC 1918 addresses, loopbacks, and cloud metadata IPs to ensure ethical and secure operation.
