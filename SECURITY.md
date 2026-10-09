# Security Policy & Responsible Disclosure

XELOVO is dedicated to maintaining high security standards across our application, API services, and network probes.

---

## Supported Versions

| Version | Supported |
| :--- | :---: |
| v1.0.x (Current Master) | :white_check_mark: |

---

## Reporting a Vulnerability

If you discover a security vulnerability or weakness within XELOVO (such as an SSRF bypass, authentication flaw, or data handling issue):

1. **Do Not File a Public Issue**: Please do not publish security vulnerabilities in public GitHub issues or public forums.
2. **Email Disclosure**: Send a detailed report to **`xelavo.sec26@gmail.com`**.
3. **Report Contents**:
   - Description of the vulnerability.
   - Steps to reproduce or Proof-of-Concept (PoC).
   - Potential security impact.
4. **Response Time**: The project team (Anshika Goswami & Dhruvi Solanki) will acknowledge your report within **48 hours** and provide periodic remediation updates.

---

## Defensive Use & Scope

XELOVO network tools enforce built-in Server-Side Request Forgery (SSRF) controls blocking loopback (`127.0.0.0/8`, `::1`), private IPv4 ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), and cloud metadata services (`169.254.169.254`). All security assessments must be performed on authorized target infrastructure.
