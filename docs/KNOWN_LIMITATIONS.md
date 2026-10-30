# XELOVO System Scope, Boundaries & Known Limitations

**Platform:** XELOVO Cybersecurity & Threat Intelligence Platform  
**Authors & Leads:** Anshika Goswami (Founder & Project Lead), Dhruvi Solanki (Technical Lead & Frontend Developer)  
**Technical Identity:** PXT sec26-27 | Government Polytechnic Valsad, Information Technology Department  
**Classification:** Defensive Engineering Transparency Document  

---

## 1. Ethical & Architectural Scope

XELOVO is designed exclusively as an **evidence-based defensive security intelligence and digital investigation platform**.

### Core Tenet: Zero Fabrication
Unlike many mock cybersecurity portals or educational demos, XELOVO strictly enforces a **Zero Fabrication Guarantee**:
- **No Synthetic Threat Data:** Threat scores, certificate parameters, and HTTP headers are derived strictly from live socket probes or deterministic cryptographic hashing.
- **Transparent Disclosure:** If an external threat intelligence API (such as VirusTotal or HaveIBeenPwned) is not configured with a valid API key, XELOVO returns an explicit `UNAVAILABLE` or `API Unconfigured` status. It **never** manufactures simulated infection counts or fake breach records.

---

## 2. Technical Boundaries & Network Limitations

### 2.1 Server-Side Request Forgery (SSRF) Boundary
- **Limitation:** XELOVO cannot be used to scan internal network infrastructure (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`) or localhost endpoints.
- **Rationale:** Strict adherence to OWASP Top 10 A10:2021 (SSRF Prevention). The probing engine intentionally refuses loopback traversal to prevent attackers or malicious users from pivoting into local services or cloud hypervisor metadata endpoints.

### 2.2 Split-Horizon & Private DNS
- **Limitation:** The `domain-intelligence` and `exposure-map` workstations query public recursive DNS resolvers via Node.js native `dns.promises`.
- **Impact:** Internal corporate Active Directory zones, split-horizon private DNS views, and firewalled non-public nameservers cannot be resolved by design.

### 2.3 Layer-7 Cloudflare / CDN Intermediaries
- **Limitation:** When scanning domains protected by reverse-proxy CDNs (e.g., Cloudflare, Akamai, Fastly, AWS CloudFront), the IP addresses resolved by `A` records and TLS certificates returned during the handshake represent the edge CDN nodes, not the origin server.
- **Transparency:** XELOVO's findings note this provenance accurately in the classified observations.

### 2.4 Browser-Enforced Password Hygiene
- **Limitation:** The `password-analyzer` workstation does not transmit password strings to remote breach APIs (e.g. Pwned Passwords / k-Anonymity API) in default operation.
- **Rationale:** Transmitting plaintext passwords over remote network sockets introduces credential leakage risks. XELOVO performs 100% of password entropy calculations locally in client memory using Shannon entropy algorithms.

---

## 3. Third-Party Intelligence Feed Configurations

The platform is architected with modular integration hooks for external threat intelligence providers. When optional environment variables are omitted, the following transparent behaviors apply:

| Intelligence Provider | Environment Variable | Default Behavior Without Key |
| :--- | :--- | :--- |
| **VirusTotal API** | `VIRUSTOTAL_API_KEY` | File and hash analysis returns `API Unconfigured` status; calculates accurate local SHA-256/SHA-1/MD5 digests and displays transparent remediation guidance. |
| **Shodan Host Intelligence** | `SHODAN_API_KEY` | Network exposure analysis relies on direct socket probes and declares external Shodan enrichment as unconfigured. |
| **AbuseIPDB Threat Reports** | `ABUSEIPDB_API_KEY` | IP reputation checks note that external crowdsourced reporting is unconfigured, preventing fabricated risk ratings. |
| **HaveIBeenPwned API** | `HIBP_API_KEY` | Breach check declares `UNAVAILABLE` with guidance on adding organizational domain breach monitoring keys. |

---

## 4. Operational & Resource Limitations

- **Concurrent Rate Throttling:** The built-in rate limiter caps API requests to 150 per minute per IP and probe executions to 40 per minute per IP to prevent socket starvation and maintain host availability.
- **Upload File Size:** File analysis (`file-hash`, `metadata-inspector`) is capped at 15 MB to prevent memory exhaustion in server-side buffers.
- **Network Probe Timeouts:** Probes timeout automatically after 7,000–8,000 milliseconds if a remote host fails to complete a TLS handshake or HTTP socket exchange.
