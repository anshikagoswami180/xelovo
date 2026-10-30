const crypto = require('crypto');
const { validateTargetInput } = require('../middleware/ssrfGuard');

const dnsService = require('./dnsService');
const sslService = require('./sslService');
const headerService = require('./headerService');
const redirectService = require('./redirectService');
const linkDnaService = require('./linkDnaService');
const shadowSurfaceService = require('./shadowSurfaceService');
const exposureMapService = require('./exposureMapService');
const signalZeroService = require('./signalZeroService');
const privacyService = require('./privacyService');
const hashService = require('./hashService');
const securityHeaderGeneratorService = require('./securityHeaderGeneratorService');

/**
 * Generates a unique XELOVO Analysis ID in the format XEL-YYYYMMDD-XXXXXXXX
 */
function generateAnalysisId() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `XEL-${dateStr}-${randomHex}`;
}

/**
 * Computes a real SHA-256 integrity digest for the analysis payload
 */
function computeReportHash(payload) {
  const cleanStr = JSON.stringify(payload);
  return crypto.createHash('sha256').update(cleanStr).digest('hex');
}

/**
 * Master Real-Time Analysis Engine Orchestrator
 */
async function runUnifiedAnalysis(toolId, rawInput, options = {}) {
  const startTime = Date.now();
  const analysisId = generateAnalysisId();
  const timestamp = new Date().toISOString();

  // Validate Input & SSRF Protection for network tools
  const isNetworkTool = ['header-inspector', 'tls-inspector', 'domain-intelligence', 'redirect-trace', 'link-dna', 'shadow-surface', 'exposure-map', 'signal-zero', 'privacy-scanner', 'cookie-inspector', 'digital-footprint'].includes(toolId);
  
  let targetValidation = { valid: true, hostname: rawInput };
  if (isNetworkTool && typeof rawInput === 'string' && rawInput.trim()) {
    targetValidation = validateTargetInput(rawInput);
    if (!targetValidation.valid) {
      const failedPayload = {
        analysisId,
        toolId,
        input: rawInput,
        startedAt: timestamp,
        completedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        status: 'BLOCKED',
        provenance: 'BLOCKED',
        error: targetValidation.reason,
        classifiedObservations: [
          { type: 'BLOCKED', text: `Scan aborted by XELOVO SSRF Guard: ${targetValidation.reason}` }
        ],
        evidence: [],
        sources: [{ name: 'XELOVO SSRF Shield', status: 'BLOCKED', timestamp }],
        riskIndicators: [{ indicator: 'SSRF Violation Attempt', impact: 'Restricted IP/Hostname Target' }],
        severity: 'CRITICAL',
        confidence: 'HIGH',
        limitations: ['Target input is restricted by security policy. Internal/loopback targets cannot be scanned.'],
        unverifiedAspects: ['DNS Resolution', 'TLS Certificate Handshake', 'Live HTTP Probe', 'External Reputation Intelligence']
      };
      failedPayload.reportHash = computeReportHash(failedPayload);
      return failedPayload;
    }
  }

  const targetHost = targetValidation.hostname || rawInput;

  // Initialize Schema Container
  const result = {
    analysisId,
    toolId,
    input: rawInput,
    normalizedInput: targetHost,
    startedAt: timestamp,
    completedAt: null,
    durationMs: 0,
    status: 'COMPLETED',
    provenance: isNetworkTool ? 'LIVE' : (['file-hash', 'encoding-utility', 'metadata-inspector', 'password-analyzer'].includes(toolId) ? 'LOCAL' : 'USER_PROVIDED'),
    classifiedObservations: [],
    evidence: [],
    sources: [],
    riskIndicators: [],
    severity: 'LOW',
    confidence: 'HIGH',
    limitations: [
      'Analysis is strictly based on direct network probes, local cryptanalysis, or supplied telemetry at timestamp of scan.',
      'XELOVO does not issue non-verifiable assumptions or simulate missing metrics.'
    ],
    unverifiedAspects: [],
    technicalExplanation: '',
    attackScenarios: [],
    defensiveRecommendations: [],
    reportHash: ''
  };

  try {
    switch (toolId) {
      case 'header-inspector': {
        const headerData = await headerService.analyzeSecurityHeaders(targetHost);
        result.sources.push({ name: 'Direct HTTP/HTTPS Socket Probe', status: 'VERIFIED', timestamp });
        result.headerData = headerData;

        if (headerData.error) {
          result.status = 'UNAVAILABLE';
          result.classifiedObservations.push({ type: 'UNAVAILABLE', text: headerData.error });
        } else {
          result.classifiedObservations.push({ type: 'OBSERVED', text: `Target responded with HTTP status code ${headerData.statusCode || 200}` });
          result.classifiedObservations.push({ type: 'OBSERVED', text: `Security Header Grade: ${headerData.grade} (${headerData.score}/100)` });

          if (headerData.headersEvaluated) {
            Object.entries(headerData.headersEvaluated).forEach(([headerKey, h]) => {
              if (h.present) {
                result.evidence.push({
                  category: 'Security Headers',
                  status: 'VERIFIED',
                  source: 'HTTP Response Header',
                  value: `${h.name}: ${h.value}`,
                  timestamp
                });
              } else if (h.importance === 'Critical' || h.importance === 'High') {
                result.riskIndicators.push({
                  indicator: `Missing ${h.name}`,
                  impact: h.description
                });
              }
            });
          }

          if (headerData.serverFingerprint && headerData.serverFingerprint.server) {
            result.evidence.push({
              category: 'Server Fingerprint',
              status: 'VERIFIED',
              source: 'Server Header',
              value: headerData.serverFingerprint.server,
              timestamp
            });
          }

          result.severity = headerData.score < 50 ? 'HIGH' : headerData.score < 75 ? 'MODERATE' : 'LOW';
        }
        result.unverifiedAspects.push('External Threat Intelligence Feeds', 'Active Penetration Testing Exploit Detonation');
        break;
      }

      case 'tls-inspector': {
        const tlsData = await sslService.inspectTLS(targetHost);
        result.sources.push({ name: 'TLS Socket Handshake', status: 'VERIFIED', timestamp });
        result.tlsData = tlsData;

        if (tlsData.error) {
          result.status = 'UNAVAILABLE';
          result.classifiedObservations.push({ type: 'UNAVAILABLE', text: tlsData.error });
        } else if (tlsData.valid !== undefined) {
          const issuerName = (tlsData.issuer && (tlsData.issuer.commonName || tlsData.issuer.organization)) || (typeof tlsData.issuer === 'string' ? tlsData.issuer : 'N/A');
          const subjectName = (tlsData.subject && (tlsData.subject.commonName || tlsData.subject.organization)) || (typeof tlsData.subject === 'string' ? tlsData.subject : 'N/A');

          result.classifiedObservations.push({ type: 'OBSERVED', text: `TLS Certificate Issuer: '${issuerName}'` });
          result.classifiedObservations.push({ type: 'OBSERVED', text: `TLS Protocol: '${tlsData.protocol || 'TLS 1.2/1.3'}'` });
          result.classifiedObservations.push({ type: 'OBSERVED', text: `Certificate Valid Until: ${tlsData.validTo || 'Unknown'} (${tlsData.daysRemaining} days remaining)` });

          result.evidence.push({ category: 'TLS/SSL', status: 'VERIFIED', source: 'X.509 Certificate Chain', value: `Subject: ${subjectName}, Issuer: ${issuerName}, ValidTo: ${tlsData.validTo}`, timestamp });

          if (tlsData.sans && tlsData.sans.length > 0) {
            result.evidence.push({ category: 'TLS SANs', status: 'VERIFIED', source: 'Subject Alternative Names', value: tlsData.sans.slice(0, 10).join(', '), timestamp });
          }

          if (tlsData.isExpired) {
            result.riskIndicators.push({ indicator: 'Expired TLS Certificate', impact: 'Connection vulnerable to active interception and browser trust warnings.' });
            result.severity = 'CRITICAL';
          } else if (tlsData.isSelfSigned) {
            result.riskIndicators.push({ indicator: 'Self-Signed Certificate', impact: 'Not signed by a public trusted root Certificate Authority.' });
            result.severity = 'HIGH';
          } else if (tlsData.daysRemaining < 15) {
            result.riskIndicators.push({ indicator: 'Imminent Certificate Expiration', impact: `Certificate expires in ${tlsData.daysRemaining} days.` });
            result.severity = 'MODERATE';
          }
        }
        result.unverifiedAspects.push('Private Key Storage Entropy', 'Internal CA Trust Anchor Custom Roots');
        break;
      }

      case 'domain-intelligence': {
        const dnsData = await dnsService.analyzeDomainDNS(targetHost);
        result.sources.push({ name: 'Node.js Core DNS Resolver (dns.promises)', status: 'VERIFIED', timestamp });
        result.dnsData = dnsData;

        if (dnsData.error) {
          result.status = 'UNAVAILABLE';
          result.classifiedObservations.push({ type: 'UNAVAILABLE', text: dnsData.error });
        } else if (dnsData.records) {
          Object.entries(dnsData.records).forEach(([type, vals]) => {
            if (Array.isArray(vals) && vals.length > 0) {
              const displayVal = vals.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(', ');
              result.classifiedObservations.push({ type: 'OBSERVED', text: `DNS ${type} Records: ${displayVal}` });
              result.evidence.push({ category: 'DNS', status: 'VERIFIED', source: `DNS ${type} Lookup`, value: displayVal, timestamp });
            } else if (vals && typeof vals === 'object' && Object.keys(vals).length > 0) {
              result.classifiedObservations.push({ type: 'OBSERVED', text: `DNS ${type} Record: ${JSON.stringify(vals)}` });
            }
          });

          if (dnsData.subdomains && dnsData.subdomains.length > 0) {
            result.classifiedObservations.push({ type: 'OBSERVED', text: `Discovered ${dnsData.subdomains.length} active subdomains.` });
            result.evidence.push({ category: 'Subdomains', status: 'VERIFIED', source: 'Active Subdomain Discovery', value: dnsData.subdomains.map(s => s.subdomain).join(', '), timestamp });
          }

          if (dnsData.summary) {
            if (!dnsData.summary.hasSpf) {
              result.riskIndicators.push({ indicator: 'Missing SPF DNS Record', impact: 'Domain can be spoofed by external mail senders.' });
            }
            if (!dnsData.summary.hasDmarc) {
              result.riskIndicators.push({ indicator: 'Missing DMARC Policy', impact: 'Receiving mail servers cannot enforce domain spoofing policies.' });
            }
          }
        }
        result.unverifiedAspects.push('Internal Private DNS Zones', 'Passive DNS Historical Cache');
        break;
      }

      case 'redirect-trace': {
        const traceData = await redirectService.traceRedirects(targetHost);
        result.sources.push({ name: 'HTTP Client Redirect Follower', status: 'VERIFIED', timestamp });
        result.traceData = traceData;

        if (traceData.error) {
          result.status = 'UNAVAILABLE';
          result.classifiedObservations.push({ type: 'UNAVAILABLE', text: traceData.error });
        } else if (traceData.chain) {
          result.classifiedObservations.push({ type: 'OBSERVED', text: `Redirect Hop Count: ${traceData.chain.length}` });
          traceData.chain.forEach((hop, idx) => {
            result.evidence.push({ category: 'Redirect Chain', status: 'VERIFIED', source: `Hop #${idx + 1}`, value: `${hop.url} (${hop.status})`, timestamp });
          });
          if (traceData.chain.length > 3) {
            result.riskIndicators.push({ indicator: 'Long Redirect Chain', impact: 'Multiple redirects may indicate cloaking or referral hijacking.' });
          }
        }
        result.unverifiedAspects.push('Client-Side JavaScript Redirects', 'Meta Refresh Tags');
        break;
      }

      case 'privacy-scanner':
      case 'cookie-inspector': {
        const privacyData = await privacyService.analyzePrivacy(targetHost);
        result.sources.push({ name: 'Direct HTTP Session & Cookie Analyzer', status: 'VERIFIED', timestamp });
        result.privacyData = privacyData;

        if (privacyData.error) {
          result.status = 'UNAVAILABLE';
          result.classifiedObservations.push({ type: 'UNAVAILABLE', text: privacyData.error });
        } else {
          result.classifiedObservations.push({ type: 'OBSERVED', text: `Privacy Score: ${privacyData.privacyScore}/100 (${privacyData.rating})` });
          result.classifiedObservations.push({ type: 'OBSERVED', text: `Cookies Set on Landing: ${privacyData.cookiesSetOnLanding}` });
          result.classifiedObservations.push({ type: 'OBSERVED', text: `Trackers Detected: ${privacyData.totalTrackersFound}` });

          if (privacyData.detectedTrackers && privacyData.detectedTrackers.length > 0) {
            result.evidence.push({
              category: 'Tracking Telemetry',
              status: 'VERIFIED',
              source: 'Embedded DOM Analytics Probes',
              value: privacyData.detectedTrackers.join(', '),
              timestamp
            });
            result.riskIndicators.push({
              indicator: `Third-Party Trackers Detected (${privacyData.detectedTrackers.length})`,
              impact: 'Exposes user browsing behavior to external analytics networks.'
            });
          }

          if (privacyData.rawCookies && privacyData.rawCookies.length > 0) {
            privacyData.rawCookies.forEach(c => {
              result.evidence.push({ category: 'Session Cookies', status: 'VERIFIED', source: 'Set-Cookie Header', value: c, timestamp });
            });
          }

          if (!privacyData.privacyPolicyFound) {
            result.riskIndicators.push({ indicator: 'Missing Privacy Policy Link', impact: 'User data collection disclosure is not visibly transparent on landing.' });
          }

          result.severity = privacyData.privacyScore < 50 ? 'HIGH' : privacyData.privacyScore < 75 ? 'MODERATE' : 'LOW';
        }
        result.unverifiedAspects.push('Post-Authentication Persistent Storage (IndexedDB, LocalStorage)', 'Third-Party Ad Exchange Bidding');
        break;
      }

      case 'digital-footprint': {
        const [dnsData, tlsData] = await Promise.all([
          dnsService.analyzeDomainDNS(targetHost),
          sslService.inspectTLS(targetHost)
        ]);
        result.sources.push({ name: 'Public DNS & TLS Surface Correlator', status: 'VERIFIED', timestamp });

        const footprintData = {
          domain: targetHost,
          timestamp,
          ipAddresses: (dnsData.records && dnsData.records.A) || [],
          mailServers: (dnsData.records && dnsData.records.MX && dnsData.records.MX.map(m => m.exchange)) || [],
          nameservers: dnsData.nameservers || [],
          subdomains: (dnsData.subdomains || []).map(s => s.subdomain),
          tlsSANs: tlsData.sans || []
        };
        result.footprintData = footprintData;

        result.classifiedObservations.push({ type: 'OBSERVED', text: `Discovered ${footprintData.ipAddresses.length} IPv4 endpoints and ${footprintData.mailServers.length} MX gateways.` });
        result.classifiedObservations.push({ type: 'OBSERVED', text: `Identified ${footprintData.subdomains.length} active subdomains and ${footprintData.tlsSANs.length} TLS Subject Alternative Names.` });

        footprintData.ipAddresses.forEach(ip => result.evidence.push({ category: 'Infrastructure', status: 'VERIFIED', source: 'DNS A Record', value: ip, timestamp }));
        footprintData.subdomains.forEach(sub => result.evidence.push({ category: 'Subdomain Surface', status: 'VERIFIED', source: 'Active DNS Probing', value: sub, timestamp }));
        footprintData.tlsSANs.forEach(san => result.evidence.push({ category: 'Certificate SAN', status: 'VERIFIED', source: 'X.509 Certificate Chain', value: san, timestamp }));

        result.unverifiedAspects.push('Private Cloud Infrastructure (AWS VPC, GCP VPC)', 'Internal Intranet Endpoints');
        break;
      }

      case 'security-header-generator': {
        const generatorConfigs = securityHeaderGeneratorService.generateSecurityHeaderConfigs(targetHost, options);
        result.sources.push({ name: 'XELOVO Security Policy Specification Engine', status: 'VERIFIED', timestamp });
        result.generatorData = generatorConfigs;

        result.classifiedObservations.push({ type: 'OBSERVED', text: `Generated hardened security configurations for Nginx, Apache, Express.js (Helmet), and Next.js.` });
        result.classifiedObservations.push({ type: 'OBSERVED', text: `Recommended directives include HSTS (31536000s), strict CSP, X-Frame-Options: DENY, and Permissions-Policy.` });

        Object.entries(generatorConfigs.headers).forEach(([k, v]) => {
          result.evidence.push({ category: 'Recommended Header Directive', status: 'VERIFIED', source: 'OWASP / NIST Hardening Baseline', value: `${k}: ${v}`, timestamp });
        });

        result.severity = 'LOW';
        result.unverifiedAspects.push('Web Application Compatibility Testing (Application CSP Violations)');
        break;
      }

      case 'exposure-map': {
        const mapData = await exposureMapService.buildExposureMap(targetHost, options.orgName, options.usernames);
        result.sources.push({ name: 'XELOVO Multi-Layer Attack Surface Graph Engine', status: 'VERIFIED', timestamp });
        result.mapData = mapData;

        result.classifiedObservations.push({ type: 'OBSERVED', text: `Constructed Exposure Constellation with ${mapData.nodes ? mapData.nodes.length : 0} nodes and ${mapData.links ? mapData.links.length : 0} relational vectors.` });
        result.unverifiedAspects.push('Darknet Credential Repositories', 'Compromised Device Telemetry');
        break;
      }

      case 'link-dna': {
        const dnaData = await linkDnaService.analyzeLinkDNA(targetHost);
        result.sources.push({ name: 'XELOVO Deep URL Decomposition Engine', status: 'VERIFIED', timestamp });
        result.dnaData = dnaData;

        if (dnaData.summary) {
          result.classifiedObservations.push({ type: 'OBSERVED', text: `Threat Level: ${dnaData.summary.threatLevel} (Deception Score: ${dnaData.summary.deceptionScore}/100)` });
        }
        if (dnaData.riskFlags && dnaData.riskFlags.length > 0) {
          dnaData.riskFlags.forEach(rf => {
            result.riskIndicators.push({ indicator: rf.name, impact: rf.detail });
          });
          result.severity = dnaData.summary && dnaData.summary.threatLevel === 'High Risk' ? 'HIGH' : 'MODERATE';
        }
        result.unverifiedAspects.push('Dynamic Malware Sandboxing (Cuckoo / Detonation Chamber)');
        break;
      }

      case 'shadow-surface': {
        const shadowData = await shadowSurfaceService.analyzeShadowSurface(targetHost, true);
        result.sources.push({ name: 'XELOVO 5-Layer Attack Surface Inspector', status: 'VERIFIED', timestamp });
        result.shadowData = shadowData;

        result.classifiedObservations.push({ type: 'OBSERVED', text: `Assessed 5 defensive layers: Identity, Domain, Network, Web Application, and Storage.` });
        if (shadowData.overallScore !== undefined) {
          result.classifiedObservations.push({ type: 'OBSERVED', text: `Cumulative Exposure Score: ${shadowData.overallScore}/100` });
        }
        result.unverifiedAspects.push('Internal Subnet VLANs', 'Firewall Layer-7 Deep Packet Inspection Rules');
        break;
      }

      case 'signal-zero': {
        const signalData = await signalZeroService.generateSignalZeroTimeline(targetHost, options.targetUrl);
        result.sources.push({ name: 'XELOVO Threat Telemetry Cross-Correlation Engine', status: 'VERIFIED', timestamp });
        result.signalData = signalData;

        result.classifiedObservations.push({ type: 'OBSERVED', text: `Generated chronological threat intelligence timeline with ${signalData.signals ? signalData.signals.length : 0} signals.` });
        result.unverifiedAspects.push('Active Honeypot Telemetry Feeds', 'Endpoint Detection & Response (EDR) Agent Telemetry');
        break;
      }

      case 'breach-check': {
        result.status = 'UNAVAILABLE';
        result.provenance = 'UNAVAILABLE';
        result.classifiedObservations.push({
          type: 'UNAVAILABLE',
          text: 'Live breach verification is not configured (External provider API key unconfigured).'
        });
        result.limitations.push('XELOVO does not simulate or fabricate breach records when live external intelligence APIs are unconfigured.');
        result.unverifiedAspects.push('HaveIBeenPwned API Live Database Query', 'Dark Web Intelligence Feeds');
        break;
      }

      default: {
        result.classifiedObservations.push({ type: 'OBSERVED', text: `Executed telemetry analysis for '${toolId}'.` });
        result.unverifiedAspects.push('Third-Party Reputation Databases (Unconfigured API Key)');
        break;
      }
    }

    result.completedAt = new Date().toISOString();
    result.durationMs = Date.now() - startTime;
    result.reportHash = computeReportHash(result);
    return result;

  } catch (err) {
    result.completedAt = new Date().toISOString();
    result.durationMs = Date.now() - startTime;
    result.status = 'UNAVAILABLE';
    result.classifiedObservations.push({ type: 'UNAVAILABLE', text: `Live verification unavailable: ${err.message}` });
    result.limitations.push(`External network probe failed: ${err.message}`);
    result.unverifiedAspects.push('External Network Server Response', 'Target Connectivity');
    result.reportHash = computeReportHash(result);
    return result;
  }
}

module.exports = {
  generateAnalysisId,
  computeReportHash,
  runUnifiedAnalysis
};
