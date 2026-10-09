const { analyzeDomainDNS } = require('./dnsService');
const { inspectTLS } = require('./sslService');
const { analyzeSecurityHeaders } = require('./headerService');

async function analyzeShadowSurface(domainInput, authorizationConfirmed = false) {
  let domain = domainInput.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '');

  if (!authorizationConfirmed) {
    return {
      domain,
      error: 'Explicit authorization confirmation is required for Shadow Surface scan.',
      timestamp: new Date().toISOString()
    };
  }

  // Execute 3 real parallel probes
  const [dnsResult, tlsResult, headerResult] = await Promise.all([
    analyzeDomainDNS(domain),
    inspectTLS(domain),
    analyzeSecurityHeaders(`https://${domain}`)
  ]);

  // Construct 5 Attack Surface Layers
  const layers = {
    identity: {
      layerId: 1,
      name: 'Identity Layer',
      description: 'Domain registration, WHOIS privacy indicators, & administrative posture',
      expectedExposed: ['Primary Domain Name', 'Public Nameservers'],
      observableExposed: [
        `Domain: ${domain}`,
        dnsResult.nameservers && dnsResult.nameservers.length > 0 ? `Nameservers: ${dnsResult.nameservers.slice(0, 2).join(', ')}` : 'Nameservers Unresolved',
        dnsResult.records && dnsResult.records.SOA ? 'SOA Record Present' : 'SOA Record Hidden'
      ],
      exposureScore: dnsResult.summary ? (dnsResult.summary.hasDmarc ? 20 : 60) : 50,
      findings: [
        dnsResult.summary && !dnsResult.summary.hasSpf ? 'Missing SPF record (email spoofing risk)' : null,
        dnsResult.summary && !dnsResult.summary.hasDmarc ? 'Missing DMARC policy (email domain protection missing)' : null
      ].filter(Boolean)
    },
    domain: {
      layerId: 2,
      name: 'Domain Layer',
      description: 'Public subdomains, mail exchanges, and alternative host records',
      expectedExposed: ['Main Domain (A Record)', 'Mail Server (MX Record)'],
      observableExposed: [
        `A Records: ${(dnsResult.records && dnsResult.records.A || []).join(', ') || 'None'}`,
        `MX Records: ${(dnsResult.records && dnsResult.records.MX || []).map(m=>m.exchange).join(', ') || 'None'}`,
        `Discovered Subdomains: ${(dnsResult.subdomains || []).length} active hosts`
      ],
      exposureScore: (dnsResult.subdomains || []).length * 15 + 20,
      subdomainsDiscovered: dnsResult.subdomains || [],
      findings: (dnsResult.subdomains || []).length > 2 ? [`${dnsResult.subdomains.length} public subdomains discovered via standard resolution.`] : []
    },
    web: {
      layerId: 3,
      name: 'Web Layer',
      description: 'HTTP security headers, web servers, and client security constraints',
      expectedExposed: ['HTTP Port 80/443', 'Enforced CSP & HSTS'],
      observableExposed: [
        headerResult.serverFingerprint && headerResult.serverFingerprint.server ? `Server Banner: ${headerResult.serverFingerprint.server}` : 'Server Banner Hidden',
        headerResult.serverFingerprint && headerResult.serverFingerprint.poweredBy ? `X-Powered-By: ${headerResult.serverFingerprint.poweredBy}` : 'X-Powered-By Hidden',
        `Security Headers Grade: ${headerResult.grade || 'N/A'} (${headerResult.score || 0}/100)`
      ],
      exposureScore: 100 - (headerResult.score || 50),
      findings: headerResult.headersEvaluated ? Object.values(headerResult.headersEvaluated)
        .filter(h => !h.present && h.importance !== 'Low')
        .map(h => `Missing ${h.name} header`) : []
    },
    infrastructure: {
      layerId: 4,
      name: 'Infrastructure Layer',
      description: 'Public IP addresses, IPv6 availability, and network routing',
      expectedExposed: ['Production Gateway IP'],
      observableExposed: [
        `IPv4 Address(es): ${(dnsResult.records && dnsResult.records.A || []).join(', ') || 'None'}`,
        `IPv6 Address(es): ${(dnsResult.records && dnsResult.records.AAAA || []).join(', ') || 'None'}`,
        `CNAME Routing: ${(dnsResult.records && dnsResult.records.CNAME || []).join(', ') || 'Direct A Record'}`
      ],
      exposureScore: (dnsResult.records && dnsResult.records.AAAA && dnsResult.records.AAAA.length > 0) ? 30 : 45,
      findings: headerResult.serverFingerprint && headerResult.serverFingerprint.disclosesVersion ? ['Web server discloses specific software version numbers in HTTP banners.'] : []
    },
    trust: {
      layerId: 5,
      name: 'Trust Layer',
      description: 'TLS certificate chain, expiration timelines, & cipher suites',
      expectedExposed: ['Valid HTTPS Certificate'],
      observableExposed: [
        tlsResult.valid ? `TLS Valid: Issued by ${tlsResult.issuer ? tlsResult.issuer.commonName : 'N/A'}` : 'TLS Certificate Invalid or Unavailable',
        tlsResult.daysRemaining !== undefined ? `Expires in ${tlsResult.daysRemaining} days` : 'Expiration N/A',
        `SAN Domains: ${(tlsResult.sans || []).length} alternative hostnames`
      ],
      exposureScore: tlsResult.isExpired ? 90 : tlsResult.daysRemaining < 30 ? 60 : 15,
      findings: [
        tlsResult.isExpired ? 'TLS certificate has expired!' : null,
        tlsResult.daysRemaining < 30 ? `TLS certificate expires within ${tlsResult.daysRemaining} days.` : null,
        tlsResult.isSelfSigned ? 'Certificate is self-signed (not trusted by public browsers).' : null
      ].filter(Boolean)
    }
  };

  // Overall Shadow Surface Score
  const layerScores = Object.values(layers).map(l => l.exposureScore);
  const avgExposure = Math.round(layerScores.reduce((a, b) => a + b, 0) / layerScores.length);

  return {
    domain,
    authorizationConfirmed: true,
    timestamp: new Date().toISOString(),
    shadowSurfaceSummary: {
      overallExposureScore: avgExposure, // 0 = minimal exposure, 100 = high attack surface
      exposureLevel: avgExposure > 65 ? 'High Surface Exposure' : avgExposure > 40 ? 'Moderate Surface Exposure' : 'Low Surface Exposure',
      layers
    }
  };
}

module.exports = { analyzeShadowSurface };
