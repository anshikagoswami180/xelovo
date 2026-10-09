# XELOVO — Cybersecurity & Threat Intelligence Platform

> **See Threats. Know More. Stay Protected.**

XELOVO is a complete, production-oriented cybersecurity and security intelligence platform. It combines defensive attack surface visibility, authorized ethical security testing, OSINT telemetry, privacy analysis, digital footprint intelligence, and context-aware AI assistance.

---

## 1. Overview

XELOVO is built on strict empirical network scanning principles. It does not fabricate vulnerability metrics, fake progress indicators, or invent mock threats. All security analysis executes real Node.js network probes (`dns`, `tls`, `https`, `http`, `crypto`) or operates transparently with legitimate third-party API providers when configured.

### Flagship Security Engines
1. **XELOVO EXPOSURE MAP**: Generates an interactive 2D node-link constellation graph mapping target domains, subdomains, certificates, technologies, and public exposure indicators.
2. **XELOVO LINK DNA**: Deconstructs suspicious URLs into Link DNA profiles to evaluate phishing risk across Identity, Path, Redirects, Trust, and Risk signals. Employs the explicit verdict label *"Potential phishing indicators detected"* when evidence warrants.
3. **XELOVO SHADOW SURFACE**: Defensive attack surface visibility visualization comparing expected organizational exposure vs publicly observable surface across 5 structural layers (Identity, Domain, Web, Infrastructure, Trust).
4. **XELOVO SIGNAL ZERO**: Early-warning security intelligence timeline cross-correlating empirical findings from all XELOVO scanners and linking every alert directly to verified evidence.

---

## 2. Architecture Overview

```
                   ┌──────────────────────────────────────┐
                   │    React + Vite Client (Frontend)    │
                   │    - 14 Pages & Interactive Workstations
                   │    - SVG Constellation Graph & Link DNA
                   │    - X-CORE COMMAND Modal (Ctrl+K)    │
                   └──────────────────┬───────────────────┘
                                      │ REST API / JSON
                                      ▼
                   ┌──────────────────────────────────────┐
                   │    Express.js Node Backend Server    │
                   │    - JWT Authentication & Audit Log  │
                   │    - Real-time Security Engines      │
                   └──────────────────┬───────────────────┘
                                      │ SQLite Database
                                      ▼
                   ┌──────────────────────────────────────┐
                   │    SQLite Database (better-sqlite3)  │
                   │    - Isolated User Data, Scans, Logs │
                   └──────────────────────────────────────┘
```

---

## 3. Folder Structure

```
XELOVO/
├── README.md
├── package.json
├── server/
│   ├── index.js                  # Main Express Server
│   ├── db.js                     # SQLite Database Schema & Init
│   ├── middleware/
│   │   └── auth.js               # JWT Auth & Session Middleware
│   ├── routes/
│   │   ├── authRoutes.js         # Register, Login, User me
│   │   ├── scanRoutes.js         # Master Execution Router for 18 Tools
│   │   ├── intelligenceRoutes.js # Phase 2 Intelligence & Comparisons
│   │   ├── reportRoutes.js       # Security Report Builder API
│   │   └── userRoutes.js         # Notifications & Audit Logs
│   └── services/
│       ├── dnsService.js         # Node.js DNS Record Resolver
│       ├── sslService.js         # TLS/SSL Certificate Inspector
│       ├── headerService.js      # HTTP Security Header Inspector
│       ├── redirectService.js    # Safe HTTP Redirect Tracer Engine
│       ├── linkDnaService.js     # Link DNA Phishing Threat Analyzer
│       ├── shadowSurfaceService.js # Shadow Surface 5-Layer Inspector
│       ├── exposureMapService.js # Constellation Graph Generator
│       ├── signalZeroService.js  # Early Warning Signal Engine
│       ├── privacyService.js     # DOM & Request Privacy Scanner
│       ├── hashService.js        # File & Text Cryptographic Hasher
│       ├── metadataService.js    # EXIF / File Metadata Extractor
│       └── aiService.js          # XELOVO Contextual AI Assistant Engine
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx               # Router & Global Layout
        ├── main.jsx              # React DOM Entry
        ├── index.css             # Glassmorphism & Modern CSS Tokens
        ├── components/
        │   ├── Navbar.jsx        # Navigation Header
        │   ├── Footer.jsx        # Technical Footer
        │   ├── XCoreLogo.jsx     # Custom 4-Path X-Core Animated Logo
        │   ├── XCoreCommandModal.jsx # X-CORE COMMAND Launcher (Ctrl+K)
        │   ├── XelavoAIChat.jsx  # Context-Aware AI Assistant Drawer
        │   ├── ExposureMapConstellation.jsx # Interactive Constellation
        │   ├── LinkDnaVisualizer.jsx # Link DNA Strand Profile
        │   ├── ShadowSurfaceStack.jsx # 5-Layer Attack Surface Stack
        │   └── SignalZeroTimeline.jsx # Early Warning Signal Timeline
        ├── pages/
        │   ├── LandingPage.jsx   # Main Homepage
        │   ├── LoginPage.jsx     # Sign In
        │   ├── RegisterPage.jsx  # Registration
        │   ├── DashboardPage.jsx # Personal Command Dashboard
        │   ├── ToolsPage.jsx     # Filterable Directory of 18 Tools
        │   ├── ToolDetailPage.jsx# Interactive Workstation for All Tools
        │   ├── IntelligenceCenterPage.jsx # Phase 2 Intelligence Hub
        │   ├── ReportsPage.jsx   # Report Builder & PDF Print Hub
        │   ├── HistoryPage.jsx   # Scan History & Audit Logs
        │   ├── DocumentationPage.jsx # User & Technical Docs
        │   ├── XelavoAiPage.jsx  # Full-Page AI Assistant
        │   ├── ProfilePage.jsx   # User Profile
        │   ├── SettingsPage.jsx  # API Key Configuration
        │   ├── SecurityPage.jsx  # Ethical Hacking Policy
        │   └── PrivacyPage.jsx   # Privacy Policy
        └── utils/
            └── api.js            # API Fetch Client
```

---

## 4. Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Steps
1. Clone or extract the repository:
   ```bash
   cd XELOVO
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```

---

## 5. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
JWT_SECRET=xelavo_master_jwt_secret_key_2026_super_secure
VIRUSTOTAL_API_KEY=optional_virustotal_api_key_here
```

---

## 6. Database Setup

The database uses zero-config SQLite (`better-sqlite3`). The database schema is created automatically on server boot inside `server/data/xelavo.db`.

Tables: `users`, `sessions`, `scans`, `tool_history`, `reports`, `favorites`, `investigations`, `notifications`, `audit_logs`.

---

## 7. Development Commands

To run XELOVO in development mode:

1. **Start Backend Server**:
   ```bash
   node server/index.js
   ```
   *(Backend runs on `http://localhost:5000`)*

2. **Start Frontend Vite Dev Server**:
   ```bash
   cd client
   npm run dev
   ```
   *(Frontend runs on `http://localhost:3000`)*

---

## 8. Production Deployment

To build and deploy XELOVO as a unified production app:

```bash
cd client
npm run build
cd ..
node server/index.js
```
The Express server will automatically serve the compiled frontend production bundle from `client/dist` on port `5000`.

---

## 9. Security Model & Data Isolation

- **Password Security**: Passwords are hashed using `bcryptjs` with salt rounds = 10.
- **Session Tokens**: JWT tokens expire in 7 days and must be included in the `Authorization: Bearer <token>` header.
- **Client-Side Hashing**: Password entropy analysis is computed 100% locally in browser memory. Passwords are never sent over HTTP.
- **Isolated User Data**: All scans, reports, and audit logs are scoped strictly to the authenticated user's ID.

---

## 10. Authorization Requirements

Target security assessments (such as **Shadow Surface** and **Exposure Map**) require explicit user confirmation via an interactive authorization checkbox before execution to ensure compliance with ethical security testing standards.

---

## 11. Known Limitations

- DNS/TLS inspection is subject to public network connectivity and target host responsiveness.
- VirusTotal live malware queries require a valid `VIRUSTOTAL_API_KEY` configured in `.env`. When unconfigured, XELOVO displays a transparent status: *"No verified result is currently available."* without fabricating data.

---

## 12. Future Phase 3 Roadmap

1. **Automated Cron Scan Monitoring**: Periodic background re-scanning of target domains for security regression alerts.
2. **SIEM & Webhook Integrations**: Export Signal Zero threat feeds directly to Slack, Microsoft Teams, or custom enterprise webhooks.
3. **Local AI Model Sidecar**: Support for offline Ollama/LocalAI integration for air-gapped security operations centers (SOC).
