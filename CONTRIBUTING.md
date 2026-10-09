# Contributing to XELOVO

Thank you for your interest in contributing to **XELOVO**! We welcome bug reports, feature enhancements, documentation improvements, and security research.

---

## 1. Code of Conduct & Principles

When contributing to XELOVO, please adhere to our core project principles:
- **Evidence-First**: All security analysis features must rely on verified empirical telemetry. Never introduce fake metrics or simulated vulnerability findings.
- **Defensive & Responsible**: Features must support authorized security assessment, privacy research, and defensive threat modeling.
- **SSRF Safety**: Ensure network probe services enforce strict input validation via `ssrfGuard.js`.

---

## 2. Getting Started

1. **Fork & Clone**:
   ```bash
   git clone https://github.com/anshikagoswami180/xelovo.git
   cd xelovo
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

3. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## 3. Pull Request Guidelines

Before submitting a Pull Request (PR):
1. **Verify Production Build**: Ensure `npm run build` inside `client/` completes with zero errors.
2. **Verify Server Initialization**: Ensure Express server initializes cleanly (`npm run server`).
3. **Check Security**: Do not commit `.env` files, API keys, credentials, or local SQLite database files (`server/data/*.db`).
4. **Descriptive Commit Messages**: Use clear commit messages (e.g. `feat: add DNSSEC verification to dnsService`).

---

## 4. Academic & Project Credits

XELOVO is developed by **Anshika Goswami** (Project Founder & Project Lead) and **Dhruvi Solanki** (Technical Lead & Frontend Developer) under **Government Polytechnic Valsad, IT Dept, Sem 5, Group 15 (PXT sec26-27)**.

For questions, contact `xelavo.sec26@gmail.com`.
