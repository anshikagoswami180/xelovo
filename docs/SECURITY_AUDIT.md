# XELOVO Security Architecture & OWASP Audit Report

**Platform Identity:** XELOVO Defensive Cybersecurity & Digital Investigation Platform  
**Authors & Leads:** Anshika Goswami (Founder & Project Lead), Dhruvi Solanki (Technical Lead & Frontend Developer)  
**Academic & Technical Identity:** PXT sec26-27 | Government Polytechnic Valsad, Information Technology Department  
**Audit Classification:** Production Defensive Security Review  
**Date:** October 2026  
**Status:** Hardened & Verified  

---

## 1. Executive Summary

This document presents the complete security audit, threat model, and defense-in-depth architecture of the **XELOVO** cybersecurity platform. XELOVO is engineered specifically for defensive threat analysis, open-source intelligence (OSINT), application security auditing, and forensic awareness. 

Because XELOVO is itself a security platform that performs live network probes and receives external URLs, domain names, payloads, and file uploads, security hardening has been designed and implemented at every layer:
- **Zero Fabrication Policy:** All observations originate from empirical network probes, cryptographic hashes, or explicit local computations.
- **Strict SSRF Boundary Defense:** Absolute prohibition of internal network probing, loopback traversal, and cloud metadata access.
- **Cryptographic Report Integrity:** Every completed scan generates a deterministic SHA-256 digest (`reportHash`) and unique tracking identifier (`XEL-YYYYMMDD-XXXXXXXX`).
- **Privacy-by-Design:** Sensitive tools (e.g., Password Analyzer) operate 100% locally in browser memory; credentials are never transmitted over network sockets.

---

## 2. OWASP Top 10 & API Security Audit Matrix

| OWASP Vulnerability Category | Risk Scenario in XELOVO | Mitigation Implemented | Verification Status |
| :--- | :--- | :--- | :--- |
| **A01: Broken Access Control** | Unauthorized scan retrieval or cross-user record modification. | SQLite queries filter explicitly by authenticated `user_id`. Non-authenticated users fallback safely to demo scope. | **VERIFIED** |
| **A02: Cryptographic Failures** | Weak password hashing or sensitive credential exposure in transit. | Passwords hashed using `bcryptjs` with auto-salted rounds (10). SHA-256 report integrity hashing. HSTS enforced (`max-age=31536000`). | **VERIFIED** |
| **A03: Injection (SQL / Command)** | SQL injection in scan queries or unauthorized OS command execution. | Parameterized queries (`better-sqlite3` prepared statements); zero shell execution (`child_process.exec` is strictly prohibited across all routes and services). | **VERIFIED** |
| **A04: Insecure Design** | Hallucinated or simulated scan results misleading analysts. | Honest Response Architecture: when external APIs are unconfigured (e.g. VirusTotal, HIBP), the platform transparently reports unconfigured state rather than faking data. | **VERIFIED** |
| **A05: Security Misconfiguration** | Information disclosure via server headers (`X-Powered-By`), permissive CORS, or missing security directives. | Express fingerprinting disabled (`app.disable('x-powered-by')`). Strict headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`. | **VERIFIED** |
| **A06: Vulnerable & Outdated Components** | Known CVEs in dependencies. | Minimal dependency surface. Core networking relies on Node.js native standard libraries (`tls`, `https`, `http`, `dns.promises`, `crypto`, `net`). | **VERIFIED** |
| **A07: Identification & Auth Failures** | Credential brute-forcing, weak password policies. | Sliding-window in-memory rate limiting on `/api/auth` and `/api/scans`. High-entropy JWT secrets. Password entropy analyzer enforcing NIST SP 800-63B guidelines. | **VERIFIED** |
| **A08: Software & Data Integrity Failures** | Tampering with investigation reports. | Cryptographic report hashing (`crypto.createHash('sha256')`) applied to full scan output payload on completion. | **VERIFIED** |
| **A09: Security Logging & Monitoring Failures** | Unaudited scans and unmonitored security probes. | Every scan logged to SQLite `scans` and `tool_history` tables with timestamp, target, status, and analysis ID. | **VERIFIED** |
| **A10: Server-Side Request Forgery (SSRF)** | Attacker inputting `127.0.0.1` or `169.254.169.254` to access internal microservices or cloud instance metadata. | Multi-tier `ssrfGuard.js` with loopback, private RFC 1918 range filtering, cloud metadata blocking, and hex/dword/octal IP obfuscation detection. | **VERIFIED** |

---

## 3. Server-Side Request Forgery (SSRF) Guard Architecture

XELOVO features an active network probing engine. To prevent malicious actors from using the platform as a proxy to probe internal networks or cloud infrastructure, `server/middleware/ssrfGuard.js` implements a multi-tier defense:

```
[ Incoming Target Input ]
           │
           ▼
[ URL & Hostname Normalization ] (Extracts hostname, strips protocol, port, path)
           │
           ├─► [ Obfuscation Filter ] ──► Reject Hex (0x7f...), Dword (2130706433), Octal (0177.0.0.1)
           │
           ├─► [ Forbidden Hostnames ] ─► Reject 'localhost', 'loopback', '*.local', '*.internal'
           │
           ├─► [ Cloud Metadata Filter ] ─► Reject '169.254.169.254', 'metadata.google.internal', 'instance-data'
           │
           ├─► [ RFC 1918 IPv4 Filter ] ─► Reject 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 0.0.0.0
           │
           └─► [ IPv6 Filter ] ─────────► Reject ::1, fe80::/10, fc00::/7, fd00::/8
           │
           ▼
   [ VALID PUBLIC TARGET ] ──► Proceed to Network Probe Socket
```

### Verified SSRF Guard Test Cases
1. `http://127.0.0.1:8080/admin` $\rightarrow$ **BLOCKED** (`Target '127.0.0.1' is a restricted private/loopback network address.`)
2. `http://localhost/` $\rightarrow$ **BLOCKED** (`Target 'localhost' resolves to restricted local/internal infrastructure.`)
3. `http://169.254.169.254/latest/meta-data/` $\rightarrow$ **BLOCKED** (`Target '169.254.169.254' is a restricted private/loopback network address.`)
4. `http://10.0.0.1/` $\rightarrow$ **BLOCKED** (`Target '10.0.0.1' is a restricted private/loopback network address.`)
5. `http://192.168.1.1/` $\rightarrow$ **BLOCKED** (`Target '192.168.1.1' is a restricted private/loopback network address.`)
6. `0x7f000001` (Hex loopback) $\rightarrow$ **BLOCKED** (`Target uses restricted numeric/hexadecimal IP encoding.`)
7. `https://example.com` $\rightarrow$ **ALLOWED** (Clean public target)

---

## 4. Authentication, Authorization & Session Management

- **JWT Token Handling:** User sessions are verified via Bearer tokens signed with HMAC-SHA256. Tokens are transmitted in the HTTP `Authorization` header (`Bearer <token>`).
- **Demo Mode Graceful Fallback:** If tokens are absent in academic evaluation or local testing environments, the backend safely falls back to a seeded demonstration analyst identity (`analyst@xelovo.io`), ensuring uninterrupted evaluation while preventing unauthorized elevation of privileges.
- **Password Storage:** User credentials are encrypted using `bcryptjs` with salt generation rounds of 10. Password hashes are never returned in user queries, tool history, or API telemetry.

---

## 5. Denial-of-Service (DoS) & Resource Exhaustion Defenses

- **In-Memory Rate Limiting (`server/middleware/rateLimiter.js`):**
  - General API: 150 requests per minute per IP address.
  - Probe Execution Endpoint (`/api/scans/execute`): 40 requests per minute per IP address.
  - Headers: returns `Retry-After: <seconds>` on HTTP 429 status.
- **Upload File Size Constraints:**
  - Memory storage buffer restricted to 15 MB via `multer` (`limits: { fileSize: 15 * 1024 * 1024 }`).
  - Express JSON and URL-encoded body parser restricted to 10 MB.
- **Network Socket Timeouts:**
  - HTTP header inspection timeout: 7,000 ms.
  - TLS handshake connection timeout: 8,000 ms.
  - Privacy and DOM crawler timeout: 8,000 ms.
  - Sockets explicitly destroyed on timeout to prevent file descriptor exhaustion.

---

## 6. Client-Side Data Hygiene & Cryptographic Privacy

- **Password Analyzer (`client/src/pages/ToolDetailPage.jsx`):**
  - Analysis is performed 100% locally in browser memory.
  - Uses client-side Shannon entropy calculation:
    $$\text{Entropy} = L \times \log_2(R)$$
    where $L$ is character length and $R$ is pool size (lower, upper, numbers, symbols).
  - Passwords are **never** logged, cached in localStorage, or transmitted over network sockets to any server or API.
- **Encoding Utility (`encoding-utility`):**
  - Text encodings (Base64, URL encoding, local hashes) run in browser memory using native Web Crypto and string primitives.

---

## 7. Report Integrity & Audit Verification

Every completed investigation generates an immutable integrity record:
1. **Analysis ID:** Formatted as `XEL-YYYYMMDD-XXXXXXXX` (e.g., `XEL-20261026-A1B2C3D4`).
2. **Deterministic SHA-256 Digest (`reportHash`):** Computed over the sanitized results payload. Any post-analysis tampering invalidates the hash.
3. **Classification Taxonomy:** Telemetry elements are tagged with empirical statuses:
   - `OBSERVED`: Directly measured network behavior (HTTP headers, TLS parameters, DNS records).
   - `VERIFIED`: Confirmed cryptographic assertions (X.509 validity, digital certificates).
   - `UNAVAILABLE`: Explicitly declared when external third-party feeds (e.g., darknet breach dumps, commercial threat intel) are not configured.

---

## 8. Conclusion & Recommendations

The XELOVO platform has been audited and hardened according to OWASP and industry best practices. Internal network access is structurally blocked, credentials are kept secure or evaluated purely in client memory, and report outputs are cryptographically verifiable.

**Recommended Production Deployment Controls:**
- Run backend behind an Nginx reverse proxy with TLS termination (TLS 1.3 preferred).
- Keep `VIRUSTOTAL_API_KEY`, `SHODAN_API_KEY`, and `ABUSEIPDB_API_KEY` in environment variables (`.env`), never committed to source control.
- Maintain SQLite database backups in WAL mode (`server/data/xelavo.db`).
