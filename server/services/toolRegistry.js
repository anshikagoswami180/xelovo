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
const { computeHashes } = require('./hashService');

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
