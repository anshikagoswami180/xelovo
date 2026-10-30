/**
 * XELOVO Tool Registry
 * Structured registry exposing metadata, input schemas, SSRF boundary checks,
 * and execution handlers for XELOVO workstations.
 */

const { validateTargetInput } = require('../middleware/ssrfGuard');
const { analyzeSecurityHeaders } = require('./headerService');
const { inspectTLS } = require('./sslService');
const { analyzeDomainDNS } = require('./dnsService');
const { traceRedirects } = require('./redirectService');
const { analyzePrivacy } = require('./privacyService');
const { analyzeLinkDNA } = require('./linkDnaService');
const { buildExposureMap } = require('./exposureMapService');
const { analyzeShadowSurface } = require('./shadowSurfaceService');
const { generateSignalZeroTimeline } = require('./signalZeroService');
const { computeHashes, processEncoding, checkHashReputation } = require('./hashService');
const { generateSecurityHeaderConfigs } = require('./securityHeaderGeneratorService');

const toolDefinitions = {
  'header-inspector': {
    toolId: 'header-inspector',
    name: 'Security Header Inspector',
    description: 'Inspects HTTP security response headers (HSTS, CSP, X-Frame-Options, CORS) for a web target.',
    purpose: 'Analyze web application header security posture and identify missing defenses.',
    inputSchema: { target: { type: 'string', required: true, description: 'Domain name or URL (e.g., example.com)' } },
    requiresNetwork: true,
    riskLevel: 'LOW_READ_ONLY',
    execute: async ({ target }) => {
      const ssrf = validateTargetInput(target);
      if (!ssrf.valid) throw new Error(`SSRF Guard Block: ${ssrf.reason}`);
      const headersResult = await analyzeSecurityHeaders(ssrf.hostname);
      return normalizeToolOutput('header-inspector', ssrf.hostname, headersResult);
    }
  },

  'tls-inspector': {
    toolId: 'tls-inspector',
    name: 'TLS / SSL Inspector',
    description: 'Verifies SSL/TLS certificate validity, cipher suites, expiration dates, and protocol versions.',
    purpose: 'Inspect HTTPS encryption configuration and certificate chain validity.',
    inputSchema: { target: { type: 'string', required: true, description: 'Domain name (e.g., example.com)' } },
    requiresNetwork: true,
    riskLevel: 'LOW_READ_ONLY',
    execute: async ({ target }) => {
      const ssrf = validateTargetInput(target);
      if (!ssrf.valid) throw new Error(`SSRF Guard Block: ${ssrf.reason}`);
      const sslResult = await inspectTLS(ssrf.hostname);
      return normalizeToolOutput('tls-inspector', ssrf.hostname, sslResult);
    }
  },

  'domain-intelligence': {
    toolId: 'domain-intelligence',
    name: 'Domain & DNS Intelligence',
    description: 'Queries public DNS records (A, AAAA, MX, TXT, NS, CNAME) and domain infrastructure indicators.',
    purpose: 'Gather public DNS records and email authentication tokens (SPF, DKIM, DMARC).',
    inputSchema: { target: { type: 'string', required: true, description: 'Domain name' } },
    requiresNetwork: true,
    riskLevel: 'LOW_READ_ONLY',
    execute: async ({ target }) => {
      const ssrf = validateTargetInput(target);
      if (!ssrf.valid) throw new Error(`SSRF Guard Block: ${ssrf.reason}`);
      const dnsResult = await analyzeDomainDNS(ssrf.hostname);
      return normalizeToolOutput('domain-intelligence', ssrf.hostname, dnsResult);
    }
  },

  'redirect-trace': {
    toolId: 'redirect-trace',
    name: 'URL Redirect & Hops Tracer',
    description: 'Traces HTTP redirect paths, status codes, cross-domain jumps, and cloaking techniques.',
    purpose: 'Inspect URL forwarding chains to identify phishing or deceptive redirects.',
    inputSchema: { target: { type: 'string', required: true, description: 'URL to trace' } },
    requiresNetwork: true,
    riskLevel: 'LOW_READ_ONLY',
    execute: async ({ target }) => {
      const ssrf = validateTargetInput(target);
      if (!ssrf.valid) throw new Error(`SSRF Guard Block: ${ssrf.reason}`);
      const redirectResult = await traceRedirects(target);
      return normalizeToolOutput('redirect-trace', target, redirectResult);
    }
  },

  'privacy-scanner': {
    toolId: 'privacy-scanner',
    name: 'Privacy & Tracker Footprint Analyzer',
    description: 'Scans web assets for third-party tracking scripts, cookies, and data leak indicators.',
    purpose: 'Evaluate user tracking footprints and privacy compliance risks.',
    inputSchema: { target: { type: 'string', required: true, description: 'Domain or URL' } },
    requiresNetwork: true,
    riskLevel: 'LOW_READ_ONLY',
    execute: async ({ target }) => {
      const ssrf = validateTargetInput(target);
      if (!ssrf.valid) throw new Error(`SSRF Guard Block: ${ssrf.reason}`);
      const privacyResult = await analyzePrivacy(ssrf.hostname);
      return normalizeToolOutput('privacy-scanner', ssrf.hostname, privacyResult);
    }
  },

  'link-dna': {
    toolId: 'link-dna',
    name: 'Link DNA Structural Analyzer',
    description: 'Analyzes URL structure, typosquatting risk, character entropy, and suspicious domain patterns.',
    purpose: 'Identify deceptive links, typosquatting targets, and phishing domain patterns.',
    inputSchema: { target: { type: 'string', required: true, description: 'Target URL or domain' } },
    requiresNetwork: true,
    riskLevel: 'LOW_READ_ONLY',
    execute: async ({ target }) => {
      const ssrf = validateTargetInput(target);
      if (!ssrf.valid) throw new Error(`SSRF Guard Block: ${ssrf.reason}`);
      const linkResult = await analyzeLinkDNA(target);
      return normalizeToolOutput('link-dna', target, linkResult);
    }
  },

  'exposure-map': {
    toolId: 'exposure-map',
    name: 'Attack Surface Exposure Map',
    description: 'Maps public digital exposure, exposed subdomains, IP footprints, and cloud assets.',
    purpose: 'Provide a high-level digital exposure summary for authorized domains.',
    inputSchema: { target: { type: 'string', required: true, description: 'Domain name' } },
    requiresNetwork: true,
    riskLevel: 'LOW_READ_ONLY',
    execute: async ({ target }) => {
      const ssrf = validateTargetInput(target);
      if (!ssrf.valid) throw new Error(`SSRF Guard Block: ${ssrf.reason}`);
      const mapResult = await buildExposureMap(ssrf.hostname);
      return normalizeToolOutput('exposure-map', ssrf.hostname, mapResult);
    }
  },

  'hash-generator': {
    toolId: 'hash-generator',
    name: 'Cryptographic Hash Generator & Verifier',
    description: 'Computes SHA-256, MD5, SHA-1, and SHA-512 cryptographic digests for text inputs.',
    purpose: 'Generate verifiable cryptographic hashes and file integrity checksums.',
    inputSchema: { target: { type: 'string', required: true, description: 'Text or data string' } },
    requiresNetwork: false,
    riskLevel: 'SAFE_LOCAL',
    execute: async ({ target }) => {
      const hashResult = computeHashes(target || '');
      return normalizeToolOutput('hash-generator', 'Text Input', hashResult);
    }
  },

  'shadow-surface': {
    toolId: 'shadow-surface',
    name: 'Shadow Attack Surface Stack',
    description: 'Inspects five defensive attack surface layers (Identity, Domain, Network, Web Application, Storage).',
    purpose: 'Identify exposed endpoints, unmanaged DNS records, and multi-layer configuration weaknesses.',
    inputSchema: { target: { type: 'string', required: true, description: 'Domain name' } },
    requiresNetwork: true,
    riskLevel: 'CONTROLLED_PROBE',
    execute: async ({ target }) => {
      const ssrf = validateTargetInput(target);
      if (!ssrf.valid) throw new Error(`SSRF Guard Block: ${ssrf.reason}`);
      const shadowResult = await analyzeShadowSurface(ssrf.hostname, true);
      return normalizeToolOutput('shadow-surface', ssrf.hostname, shadowResult);
    }
  },

  'signal-zero': {
    toolId: 'signal-zero',
    name: 'Signal Zero Cross-Correlation Timeline',
    description: 'Generates chronological threat intelligence timeline correlating DNS, TLS, headers, and link telemetry.',
    purpose: 'Correlate disparate security signals into a unified threat timeline.',
    inputSchema: { target: { type: 'string', required: true, description: 'Domain name' } },
    requiresNetwork: true,
    riskLevel: 'LOW_READ_ONLY',
    execute: async ({ target }) => {
      const ssrf = validateTargetInput(target);
      if (!ssrf.valid) throw new Error(`SSRF Guard Block: ${ssrf.reason}`);
      const signalResult = await generateSignalZeroTimeline(ssrf.hostname);
      return normalizeToolOutput('signal-zero', ssrf.hostname, signalResult);
    }
  },

  'cookie-inspector': {
    toolId: 'cookie-inspector',
    name: 'Cookie & Session Security Inspector',
    description: 'Analyzes cookies, flags (Secure, HttpOnly, SameSite), and session exposure risks.',
    purpose: 'Detect insecure cookie attributes and tracking identifiers.',
    inputSchema: { target: { type: 'string', required: true, description: 'Domain or URL' } },
    requiresNetwork: true,
    riskLevel: 'LOW_READ_ONLY',
    execute: async ({ target }) => {
      const ssrf = validateTargetInput(target);
      if (!ssrf.valid) throw new Error(`SSRF Guard Block: ${ssrf.reason}`);
      const cookieResult = await analyzePrivacy(ssrf.hostname);
      return normalizeToolOutput('cookie-inspector', ssrf.hostname, cookieResult);
    }
  },

  'digital-footprint': {
    toolId: 'digital-footprint',
    name: 'Digital Footprint & Asset Discovery',
    description: 'Discovers public infrastructure assets, subdomains, mail gateways, and TLS SAN identities.',
    purpose: 'Map public-facing organizational digital footprint.',
    inputSchema: { target: { type: 'string', required: true, description: 'Domain name' } },
    requiresNetwork: true,
    riskLevel: 'LOW_READ_ONLY',
    execute: async ({ target }) => {
      const ssrf = validateTargetInput(target);
      if (!ssrf.valid) throw new Error(`SSRF Guard Block: ${ssrf.reason}`);
      const [dnsResult, tlsResult] = await Promise.all([
        analyzeDomainDNS(ssrf.hostname),
        inspectTLS(ssrf.hostname)
      ]);
      const footprint = {
        domain: ssrf.hostname,
        ips: (dnsResult.records && dnsResult.records.A) || [],
        subdomains: (dnsResult.subdomains || []).map(s => s.subdomain),
        nameservers: dnsResult.nameservers || [],
        tlsSANs: tlsResult.sans || []
      };
      return normalizeToolOutput('digital-footprint', ssrf.hostname, footprint);
    }
  },

  'security-header-generator': {
    toolId: 'security-header-generator',
    name: 'Security Header Generator & Hardener',
    description: 'Generates OWASP-aligned security header configuration rules for Nginx, Apache, Express.js (Helmet), and Next.js.',
    purpose: 'Produce copy-pasteable server configuration to remediate missing defensive headers.',
    inputSchema: { target: { type: 'string', required: false, description: 'Domain name (optional)' } },
    requiresNetwork: false,
    riskLevel: 'SAFE_LOCAL',
    execute: async ({ target, options = {} }) => {
      const configResult = generateSecurityHeaderConfigs(target || 'example.com', options);
      return normalizeToolOutput('security-header-generator', target || 'example.com', configResult);
    }
  },

  'file-hash': {
    toolId: 'file-hash',
    name: 'Cryptographic File & String Hasher',
    description: 'Calculates SHA-256, SHA-1, MD5, and SHA-512 hashes and queries malware reputation status.',
    purpose: 'Generate cryptographic verification digests for file and text inputs.',
    inputSchema: { target: { type: 'string', required: true, description: 'String, hash, or file content' } },
    requiresNetwork: false,
    riskLevel: 'SAFE_LOCAL',
    execute: async ({ target }) => {
      const hashResult = computeHashes(target || '');
      const rep = checkHashReputation(hashResult.sha256);
      return normalizeToolOutput('file-hash', 'Input Payload', { ...hashResult, reputation: rep });
    }
  },

  'encoding-utility': {
    toolId: 'encoding-utility',
    name: 'Cyber Encoding & Transformation Utility',
    description: 'Encodes and decodes Base64, URL encoding, Hex, and cryptographic representations.',
    purpose: 'Inspect and transform obfuscated cyber payloads.',
    inputSchema: { target: { type: 'string', required: true, description: 'Payload string' } },
    requiresNetwork: false,
    riskLevel: 'SAFE_LOCAL',
    execute: async ({ target, options = {} }) => {
      const encResult = processEncoding(target || '', options.mode || 'base64_encode');
      return normalizeToolOutput('encoding-utility', 'Text Payload', encResult);
    }
  },

  'password-analyzer': {
    toolId: 'password-analyzer',
    name: 'Password Entropy & Complexity Analyzer',
    description: 'Calculates Shannon entropy, character pool diversity, and estimated brute-force resistance locally.',
    purpose: 'Evaluate password strength 100% locally in memory without credential transmission.',
    inputSchema: { target: { type: 'string', required: true, description: 'Password string' } },
    requiresNetwork: false,
    riskLevel: 'SAFE_LOCAL',
    execute: async ({ target }) => {
      const pwd = target || '';
      const len = pwd.length;
      const hasUpper = /[A-Z]/.test(pwd);
      const hasLower = /[a-z]/.test(pwd);
      const hasNum = /[0-9]/.test(pwd);
      const hasSpec = /[^A-Za-z0-9]/.test(pwd);
      let poolSize = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasNum ? 10 : 0) + (hasSpec ? 32 : 0);
      const entropy = Math.round(len * Math.log2(poolSize || 1));
      const pwdResult = {
        length: len,
        entropyBits: entropy,
        strength: entropy > 80 ? 'Very Strong' : entropy > 60 ? 'Strong' : entropy > 40 ? 'Moderate' : 'Weak'
      };
      return normalizeToolOutput('password-analyzer', '••••••••', pwdResult);
    }
  }
};

/**
 * Normalizes tool output into a consistent, empirical schema
 */
function normalizeToolOutput(toolId, target, rawResult) {
  const timestamp = new Date().toISOString();
  let observations = [];
  let findings = [];
  let evidence = [];
  let limitations = [];

  if (rawResult && typeof rawResult === 'object') {
    observations = rawResult.observations || rawResult.details || [];
    findings = rawResult.findings || rawResult.risks || [];
    evidence = rawResult.evidence || [];
    limitations = rawResult.limitations || [];

    if (evidence.length === 0 && rawResult.headers) {
      Object.entries(rawResult.headers).forEach(([k, v]) => {
        evidence.push({ category: 'HTTP Header', value: `${k}: ${v}`, status: 'OBSERVED', source: 'Live Probe' });
      });
    }
  }

  return {
    tool: toolId,
    target,
    status: 'COMPLETED',
    timestamp,
    observations,
    findings,
    evidence,
    limitations,
    rawResult
  };
}

function getToolById(toolId) {
  return toolDefinitions[toolId] || null;
}

function listTools() {
  return Object.values(toolDefinitions).map(t => ({
    toolId: t.toolId,
    name: t.name,
    description: t.description,
    purpose: t.purpose,
    riskLevel: t.riskLevel
  }));
}

module.exports = {
  toolDefinitions,
  getToolById,
  listTools,
  normalizeToolOutput
};
