# XELOVO — Cybersecurity & Threat Intelligence Platform

> **See Threats. Know More. Stay Protected.**

XELOVO is a production-grade, evidence-driven cybersecurity threat intelligence, digital forensic analysis, and security awareness platform. Built with a zero-trust governance model, XELOVO provides defensive attack surface visibility, authorized web security assessment, digital footprint intelligence, and context-grounded AI assistance without relying on fabricated metrics or arbitrary scorecards.

---

## 1. Project Overview & Problem Statement

Modern security operations and digital investigations require exact, reproducible evidence rather than black-box security estimates or unverified risk scores. Organizations and individuals frequently face digital exposure, phishing campaigns, misconfigured TLS/SSL infrastructure, missing HTTP security headers, and data leaks.

**XELOVO** addresses this challenge by delivering an empirical defensive intelligence engine. Every security indicator evaluated on XELOVO is traceable to explicit network telemetry, raw HTTP header payloads, DNS record chains, or user-provided raw input objects.

### Intended Scope & Users
- **Security Analysts & SOC Engineers**: Perform rapid non-destructive surface mapping, domain inspection, and threat correlation.
- **Developers & DevOps Teams**: Inspect HTTP security headers (HSTS, CSP, CORS), verify SSL/TLS certificate chains, and test web hardening.
- **Digital Investigators & Researchers**: Deconstruct suspicious phishing links, analyze EXIF image metadata, inspect email headers, and evaluate privacy footprints.
- **Academic & Educational Assessment**: Provides a production-grade defensive platform built for academic evaluation and cybersecurity learning.

---

## 2. Key Implemented Features & Workstations

XELOVO features 20 purpose-built security workstations and analytical engines:

### Flagship Security Workstations
1. **XELOVO EXPOSURE MAP**: Generates interactive 2D node-link constellation graphs mapping target domains, subdomains, certificates, technologies, and public exposure indicators.
2. **XELOVO LINK DNA**: Deconstructs suspicious URLs into Link DNA structural profiles to evaluate phishing risk across Identity, Path, Redirects, Trust, and Risk signals using verifiable rules.
3. **XELOVO SHADOW SURFACE**: Defensive attack surface stack comparing expected organizational exposure vs publicly observable surface across 5 structural layers (Identity, Domain, Web, Infrastructure, Trust).
4. **XELOVO SIGNAL ZERO**: Early-warning security intelligence timeline cross-correlating empirical findings from all XELOVO scanners and linking every alert directly to verified evidence.

### Specialized Security Analyzers & Utilities
5. **Security Header Inspector**: Analyzes HSTS, CSP, X-Frame-Options, CORS, and cookie security policies.
6. **TLS / SSL Certificate Inspector**: Verifies SSL certificate validity, cipher suites, expiration dates, and protocol chains.
7. **Domain & DNS Intelligence**: Queries public DNS records (A, AAAA, MX, TXT, NS, CNAME) and SPF/DKIM/DMARC authentication tokens.
8. **URL Redirect & Hops Tracer**: Traces HTTP redirect forwarding chains, status codes, and cross-domain jumps.
9. **Privacy & Tracker Footprint Scanner**: Identifies third-party tracking scripts, cookies, and data leak vectors.
10. **Phishing & Scam Analyzer**: Analyzes suspicious text messages, raw email headers, phishing URL indicators, and scam patterns.
11. **Image & EXIF Metadata Inspector**: Extracts EXIF metadata, camera attributes, GPS coordinates, and file integrity hashes.
12. **Cryptographic Hash Generator**: Computes SHA-256, MD5, SHA-1, and SHA-512 cryptographic digests and checksums.
13. **Base64 / URL String Encoder & Decoder**: Safe string encoding and decoding utility for forensic analysis.
14. **JWT Security Decoder**: Decodes JSON Web Tokens to inspect header algorithms, payload claims, and expiration timestamps.
15. **X-CORE COMMAND (Ctrl+K)**: Instant keyboard-driven command palette for rapid platform navigation and tool launching.
16. **XELA AI Assistant**: Universal conversational AI assistant and telemetry interpretation engine (`XelaEngine`).
17. **Multi-Format Security Reporting**: Export print-ready A4 PDF, JSON, Markdown, and HTML reports with SHA-256 integrity digests.
18. **Scan History & Audit Logging**: Scoped historical audit logs tracking executed scans, timestamps, and findings.

---

## 3. Technology Stack

### Frontend Architecture
- **Framework**: React 18 with Vite
- **UI & Iconography**: Custom Dark Cybersecurity Glassmorphism CSS design system & Lucide React Icons
- **Interactive Visualizers**: Custom SVG Constellation Graph, Link DNA Strand Component, 5-Layer Surface Stack, Signal Zero Timeline
- **Routing**: React Router DOM v6

### Backend Architecture
- **Server Runtime**: Node.js v18+ with Express 5
- **Database**: Zero-config SQLite via `better-sqlite3`
- **Authentication**: JSON Web Tokens (JWT) with `bcryptjs` password hashing (10 salt rounds)
- **Security Middleware**: Multi-layer Server-Side Request Forgery (SSRF) Guard (`ssrfGuard.js`), CORS policy, Security HTTP Headers
- **File Upload Handling**: Multer in-memory storage (15MB file size limit)
- **AI Orchestration**: Modular `XelaEngine` pipeline with `RequestRouter`, `ContextManager`, `ToolRegistry`, and `AiProvider`

---

## 4. Architecture Overview

```
                   ┌──────────────────────────────────────────┐
                   │     React + Vite Client (Frontend)       │
                   │     - 15 Pages & 20 Workstations         │
                   │     - Interactive SVG Visualizers        │
                   │     - X-CORE COMMAND Modal (Ctrl+K)      │
                   │     - XELA AI Drawer & Page Interface    │
                   └────────────────────┬─────────────────────┘
                                        │ REST API / JSON
                                        ▼
                   ┌──────────────────────────────────────────┐
                   │     Express.js Server (Backend)          │
                   │     - JWT Auth & Audit Logging           │
                   │     - SSRF Guard Protection              │
                   │     - XelaEngine AI Pipeline             │
                   │     - 12 Real Network Probe Services     │
                   └────────────────────┬─────────────────────┘
                                        │ SQLite Database
                                        ▼
                   ┌──────────────────────────────────────────┐
                   │    SQLite Database (better-sqlite3)      │
                   │    - Scans, Users, Reports, Audit Logs   │
                   └──────────────────────────────────────────┘
```

---

## 5. Repository Directory Structure

```
xelovo/
├── README.md                     # Platform Documentation
├── CONTRIBUTING.md               # Contribution & Collaboration Guidelines
├── SECURITY.md                   # Responsible Vulnerability Disclosure Policy
├── .env.example                  # Environment Variables Template (Placeholders only)
├── .gitignore                    # Secrets, node_modules, and database exclusions
├── package.json                  # Root Package Scripts
├── vercel.json                   # Vercel Deployment Configuration
├── .github/
│   ├── pull_request_template.md  # PR Template
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md         # Bug Report Template
│       └── feature_request.md    # Feature Request Template
├── server/                       # Backend Application
│   ├── index.js                  # Main Express Application Entry
│   ├── db.js                     # SQLite Database Initialization & Schema
│   ├── middleware/
│   │   ├── auth.js               # JWT Authentication Middleware
│   │   └── ssrfGuard.js          # SSRF Security Guard
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication Endpoints
│   │   ├── scanRoutes.js         # Tool Execution Endpoints & XELA AI Route
│   │   ├── intelligenceRoutes.js # Threat Intelligence Endpoints
│   │   ├── reportRoutes.js       # Security Report Endpoints
│   │   └── userRoutes.js         # User Profile & Audit Endpoints
│   └── services/
│       ├── xelaEngine.js         # XELA AI Pipeline Orchestrator
│       ├── toolRegistry.js       # Tool Registry & Workstation Handlers
│       ├── requestRouter.js      # AI Intent Classification & Router
│       ├── contextManager.js     # Conversation Context & Memory Manager
│       ├── aiProvider.js         # AI Provider Adapter (Gemini / OpenAI)
│       ├── headerService.js      # HTTP Header Inspector Service
│       ├── sslService.js         # TLS/SSL Certificate Inspector
│       ├── dnsService.js         # Node.js DNS Resolver Service
│       ├── redirectService.js    # HTTP Redirect Tracer Service
│       ├── linkDnaService.js     # Link DNA Phishing Analyzer
│       ├── shadowSurfaceService.js # Shadow Surface 5-Layer Inspector
│       ├── exposureMapService.js # Constellation Graph Generator
│       ├── signalZeroService.js  # Early Warning Signal Engine
│       ├── privacyService.js     # Privacy & Tracker Scanner
│       ├── hashService.js        # Cryptographic Hash Service
│       └── metadataService.js    # EXIF Metadata Extractor
└── client/                       # Frontend Application
    ├── package.json              # Frontend Dependencies
    ├── vite.config.js            # Vite Configuration
    ├── index.html                # HTML Entry
    └── src/
        ├── App.jsx               # React Router & Global Layout
        ├── main.jsx              # Entry Render
        ├── index.css             # Glassmorphism CSS Design Tokens
        ├── components/           # UI & Visualizer Components
        ├── pages/                # Application Pages & Workstations
        └── utils/                # API Client & Client Utilities
```

---

## 6. Installation & Prerequisites

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: v2.30.0 or higher

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/anshikagoswami180/xelovo.git
   cd xelovo
   ```

2. **Install Server Dependencies**:
   ```bash
   npm install
   ```

3. **Install Client Dependencies**:
   ```bash
   cd client
   npm install
   cd ..
   ```

---

## 7. Environment Configuration

Create a `.env` file in the root directory using the placeholders provided in `.env.example`:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
SHODAN_API_KEY=your_shodan_api_key_here
ABUSEIPDB_API_KEY=your_abuseipdb_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

> [!IMPORTANT]
> Never commit real `.env` files or API secrets to Git. The `.gitignore` file automatically excludes `.env` files.

---

## 8. Development & Build Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs backend server and frontend client concurrently in development mode |
| `npm run server` | Starts Express backend server on `http://localhost:5000` |
| `npm run client` | Starts Vite frontend dev server on `http://localhost:3000` |
| `npm run build` | Compiles frontend production bundle into `client/dist` |
| `npm start` | Runs Express server in production mode |

### Running Production Build
```bash
npm run build
npm start
```
The Express server will automatically serve the compiled frontend bundle from `client/dist` on port `5000`.

---

## 9. Security, Privacy & Ethical Use Guidelines

- **Zero Fabricated Telemetry**: XELOVO never fabricates security metrics, fake open ports, or simulated vulnerability findings.
- **SSRF Boundary Guard**: Network tools enforce strict IP and hostname validation to block request forgery against loopback (`127.0.0.0/8`, `::1`), private networks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), and cloud metadata services (`169.254.169.254`).
- **Ethical Testing Confirmation**: Target assessments (Exposure Map, Shadow Surface) require explicit user confirmation via an interactive authorization checkbox before execution.
- **Defensive Focus**: XELOVO is designed exclusively for defensive posture assessment, authorized digital investigations, public OSINT gathering, security research, and academic evaluation.

---

## 10. Project Team and Credits

XELOVO was created and engineered as an academic cybersecurity platform:

- **Anshika Goswami**: Project Founder & Project Lead
  - Strategic platform vision, security governance model, evidence-first core architecture, threat-modeling design, and technical leadership.
- **Dhruvi Solanki**: Technical Lead & Frontend Developer
  - Interactive UI/UX development, SVG visualizer components, real-time telemetry presentation, client-side analytical integration, and multi-format report exports.
- **PXT sec26-27**: Technical Identity & Strategic Technology Contribution
  - Internal development codename and engineering designation assigned during platform architecture.

### Academic Credit & Institution
- **Institution**: Government Polytechnic Valsad
- **Department**: Information Technology Department
- **Academic Term**: Semester 5
- **Group Designation**: Group 15

---

## 11. Known Limitations & Roadmap

### Known Limitations
- DNS and TLS inspection depends on public network connectivity and target domain responsiveness.
- Third-party threat intelligence features (e.g. VirusTotal malware lookups) operate transparently when API keys are configured, displaying clear status notices when unconfigured.

### Planned Roadmap
1. **Automated Monitoring Cron Jobs**: Scheduled background re-scanning of target domains for security regression alerts.
2. **Enterprise SIEM & Webhook Feeds**: Export Signal Zero threat timelines to Slack, Microsoft Teams, or custom webhooks.
3. **Offline Air-Gapped AI Sidecar**: Support for local Ollama/LocalAI LLM integration for restricted SOC environments.

---

## 12. Licensing Information

XELOVO is distributed under the **ISC License**. See the `package.json` for license declaration.

---

## 13. Official Contact Information

For platform inquiries, security disclosures, technical feedback, or academic questions, contact the project maintainers:

- **Official Platform Email**: `xelavo.sec26@gmail.com`
- **GitHub Repository**: [https://github.com/anshikagoswami180/xelovo](https://github.com/anshikagoswami180/xelovo)
