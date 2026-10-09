const { analyzeDomainDNS } = require('./dnsService');
const { inspectTLS } = require('./sslService');
const { analyzeSecurityHeaders } = require('./headerService');

async function buildExposureMap(domainInput, orgName = '', usernames = []) {
  let domain = domainInput.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '');

  const [dnsData, tlsData, headerData] = await Promise.all([
    analyzeDomainDNS(domain),
    inspectTLS(domain),
    analyzeSecurityHeaders(`https://${domain}`)
  ]);

  const nodes = [];
  const links = [];

  // Central Node
  const centralId = `target:${domain}`;
  nodes.push({
    id: centralId,
    label: domain,
    type: 'target',
    category: 'Target Domain',
    severity: 'info',
    details: {
      domain,
      organization: orgName || 'Primary Domain Target',
      scannedAt: new Date().toISOString()
    }
  });

  // 1. DNS & Subdomains
  if (dnsData.records) {
    // A Records
    (dnsData.records.A || []).forEach((ip, idx) => {
      const nodeId = `ip:${ip}`;
      nodes.push({
        id: nodeId,
        label: ip,
        type: 'infrastructure',
        category: 'Public IPv4',
        severity: 'info',
        details: { recordType: 'A Record', ip }
      });
      links.push({ source: centralId, target: nodeId, relation: 'resolves_to' });
    });

    // MX Records
    (dnsData.records.MX || []).forEach((mx) => {
      const nodeId = `mx:${mx.exchange}`;
      nodes.push({
        id: nodeId,
        label: mx.exchange,
        type: 'domain',
        category: 'Mail Exchange',
        severity: 'info',
        details: { priority: mx.priority, exchange: mx.exchange }
      });
      links.push({ source: centralId, target: nodeId, relation: 'handles_mail' });
    });
  }

  // Discovered Subdomains
  (dnsData.subdomains || []).forEach((sub) => {
    const nodeId = `sub:${sub.subdomain}`;
    nodes.push({
      id: nodeId,
      label: sub.subdomain,
      type: 'subdomain',
      category: 'Public Subdomain',
      severity: 'notice',
      details: { ips: sub.ips }
    });
    links.push({ source: centralId, target: nodeId, relation: 'subdomain_of' });
  });

  // 2. SSL/TLS Certificate Node
  if (tlsData && tlsData.valid) {
    const certId = `cert:${tlsData.fingerprint || 'tls'}`;
    nodes.push({
      id: certId,
      label: `SSL: ${tlsData.issuer ? tlsData.issuer.organization || tlsData.issuer.commonName : 'TLS Cert'}`,
      type: 'certificate',
      category: 'TLS Certificate',
      severity: tlsData.daysRemaining < 30 ? 'warning' : 'safe',
      details: {
        issuer: tlsData.issuer,
        validTo: tlsData.validTo,
        daysRemaining: tlsData.daysRemaining,
        sansCount: (tlsData.sans || []).length
      }
    });
    links.push({ source: centralId, target: certId, relation: 'secured_by' });

    // SAN Nodes if manageable
    (tlsData.sans || []).slice(0, 5).forEach((sanDomain) => {
      if (sanDomain !== domain) {
        const sanId = `san:${sanDomain}`;
        if (!nodes.find(n => n.id === sanId)) {
          nodes.push({
            id: sanId,
            label: sanDomain,
            type: 'domain',
            category: 'SAN Cert Identity',
            severity: 'info',
            details: { sanDomain }
          });
          links.push({ source: certId, target: sanId, relation: 'cert_includes' });
        }
      }
    });
  }

  // 3. Security Header Exposures
  if (headerData && headerData.headersEvaluated) {
    const missingHigh = Object.values(headerData.headersEvaluated).filter(h => !h.present && (h.importance === 'High' || h.importance === 'Critical'));
    if (missingHigh.length > 0) {
      const expId = `header_exposure:${domain}`;
      nodes.push({
        id: expId,
        label: `${missingHigh.length} Missing Security Headers`,
        type: 'exposure',
        category: 'Header Exposure',
        severity: 'warning',
        details: {
          missing: missingHigh.map(h => h.name),
          grade: headerData.grade
        }
      });
      links.push({ source: centralId, target: expId, relation: 'vulnerable_to' });
    }
  }

  // 4. Technology Fingerprint Node (if server header disclosed)
  if (headerData && headerData.serverFingerprint && headerData.serverFingerprint.server) {
    const techId = `tech:${headerData.serverFingerprint.server}`;
    nodes.push({
      id: techId,
      label: headerData.serverFingerprint.server,
      type: 'technology',
      category: 'Server Technology',
      severity: headerData.serverFingerprint.disclosesVersion ? 'notice' : 'info',
      details: { serverBanner: headerData.serverFingerprint.server }
    });
    links.push({ source: centralId, target: techId, relation: 'powered_by' });
  }

  // 5. Usernames provided by user
  if (Array.isArray(usernames) && usernames.length > 0) {
    usernames.forEach(u => {
      const uId = `user:${u}`;
      nodes.push({
        id: uId,
        label: `@${u}`,
        type: 'identity',
        category: 'Known Public Handle',
        severity: 'info',
        details: { username: u }
      });
      links.push({ source: centralId, target: uId, relation: 'associated_handle' });
    });
  }

  return {
    domain,
    organization: orgName,
    timestamp: new Date().toISOString(),
    constellation: {
      totalNodes: nodes.length,
      totalLinks: links.length,
      nodes,
      links
    }
  };
}

module.exports = { buildExposureMap };
