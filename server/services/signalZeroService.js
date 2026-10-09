const { analyzeDomainDNS } = require('./dnsService');
const { inspectTLS } = require('./sslService');
const { analyzeSecurityHeaders } = require('./headerService');
const { analyzeLinkDNA } = require('./linkDnaService');

async function generateSignalZeroTimeline(targetDomain, targetUrl = null) {
  let domain = targetDomain.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '');

  const signals = [];

  // Execute multi-engine analysis concurrently
  const [dnsData, tlsData, headerData] = await Promise.all([
    analyzeDomainDNS(domain),
    inspectTLS(domain),
    analyzeSecurityHeaders(`https://${domain}`)
  ]);

  let linkData = null;
  if (targetUrl) {
    try {
      linkData = await analyzeLinkDNA(targetUrl);
    } catch(e){}
  }

  // Cross-tool correlation engine logic

  // 1. Email authentication signal
  if (dnsData.summary) {
    if (!dnsData.summary.hasSpf && !dnsData.summary.hasDmarc) {
      signals.push({
        id: `sig-${Date.now()}-1`,
        category: 'Email Authentication',
        classification: 'Threat',
        title: 'Missing SPF and DMARC Protection',
        message: `Domain ${domain} lacks both SPF and DMARC DNS policies. External attackers can forge emails appearing to originate from @${domain}.`,
        evidence: `DNS Query returned TXT records: [${(dnsData.records.TXT || []).join('; ')}]`,
        timestamp: new Date().toISOString(),
        toolRef: 'Domain Intelligence'
      });
    } else if (!dnsData.summary.hasDmarc) {
      signals.push({
        id: `sig-${Date.now()}-2`,
        category: 'Email Authentication',
        classification: 'Warning',
        title: 'DMARC Policy Absent',
        message: `SPF is present, but no _dmarc.${domain} TXT policy was detected. Inbound mail servers cannot enforce domain protection rules.`,
        evidence: 'Query for _dmarc record returned empty or invalid policy.',
        timestamp: new Date().toISOString(),
        toolRef: 'Domain Intelligence'
      });
    } else {
      signals.push({
        id: `sig-${Date.now()}-3`,
        category: 'Email Authentication',
        classification: 'Normal',
        title: 'Email Security Record Verified',
        message: `DMARC policy active for ${domain}. Mail spoofing protections are active.`,
        evidence: `DMARC Record: ${(dnsData.records.DMARC || []).join(', ')}`,
        timestamp: new Date().toISOString(),
        toolRef: 'Domain Intelligence'
      });
    }
  }

  // 2. TLS / Certificate expiration signal
  if (tlsData) {
    if (tlsData.isExpired) {
      signals.push({
        id: `sig-${Date.now()}-4`,
        category: 'Encryption & Trust',
        classification: 'Threat',
        title: 'TLS Certificate Expired',
        message: `TLS Certificate for ${domain} expired on ${tlsData.validTo}. Browsers will trigger security warnings.`,
        evidence: `Certificate serial: ${tlsData.serialNumber}, Valid To: ${tlsData.validTo}`,
        timestamp: new Date().toISOString(),
        toolRef: 'TLS Inspector'
      });
    } else if (tlsData.daysRemaining < 30) {
      signals.push({
        id: `sig-${Date.now()}-5`,
        category: 'Encryption & Trust',
        classification: 'Warning',
        title: 'TLS Certificate Approaching Expiration',
        message: `Certificate expires in ${tlsData.daysRemaining} days (${tlsData.validTo}).`,
        evidence: `Issuer: ${tlsData.issuer ? tlsData.issuer.commonName : 'N/A'}`,
        timestamp: new Date().toISOString(),
        toolRef: 'TLS Inspector'
      });
    } else {
      signals.push({
        id: `sig-${Date.now()}-6`,
        category: 'Encryption & Trust',
        classification: 'Normal',
        title: 'TLS Certificate Active',
        message: `Valid TLS Certificate issued by ${tlsData.issuer ? tlsData.issuer.commonName : 'N/A'}. ${tlsData.daysRemaining} days remaining.`,
        evidence: `Cipher: ${tlsData.cipher ? tlsData.cipher.name : 'TLS'}`,
        timestamp: new Date().toISOString(),
        toolRef: 'TLS Inspector'
      });
    }
  }

  // 3. Security Header Correlation Signal
  if (headerData) {
    if (headerData.grade === 'F' || headerData.grade === 'D') {
      signals.push({
        id: `sig-${Date.now()}-7`,
        category: 'Web Application Defense',
        classification: 'Threat',
        title: 'Critical Security Header Deficit',
        message: `Primary domain received security header grade '${headerData.grade}'. Essential protections like Content-Security-Policy or HSTS are missing.`,
        evidence: `Headers missing: ${Object.values(headerData.headersEvaluated || {}).filter(h=>!h.present).map(h=>h.name).join(', ')}`,
        timestamp: new Date().toISOString(),
        toolRef: 'Security Header Inspector'
      });
    } else {
      signals.push({
        id: `sig-${Date.now()}-8`,
        category: 'Web Application Defense',
        classification: 'Notice',
        title: 'Security Header Audit Completed',
        message: `Primary web application achieved grade '${headerData.grade}'. (${headerData.score}/100)`,
        evidence: `Server banner: ${headerData.serverFingerprint ? headerData.serverFingerprint.server || 'Hidden' : 'Hidden'}`,
        timestamp: new Date().toISOString(),
        toolRef: 'Security Header Inspector'
      });
    }
  }

  // 4. Subdomain & Attack Surface Correlation
  if (dnsData.subdomains && dnsData.subdomains.length > 0) {
    signals.push({
      id: `sig-${Date.now()}-9`,
      category: 'Attack Surface',
      classification: dnsData.subdomains.length > 3 ? 'Notice' : 'Normal',
      title: 'Subdomain Surface Visibility',
      message: `${dnsData.subdomains.length} public subdomains discovered. Ensure secondary subdomains match primary domain security header policies.`,
      evidence: `Subdomains: ${dnsData.subdomains.map(s => s.subdomain).join(', ')}`,
      timestamp: new Date().toISOString(),
      toolRef: 'Exposure Map'
    });
  }

  // 5. Link DNA correlation if link scan provided
  if (linkData && linkData.linkDnaProfile && linkData.linkDnaProfile.reputation) {
    const rep = linkData.linkDnaProfile.reputation;
    signals.push({
      id: `sig-${Date.now()}-10`,
      category: 'Phishing & Deception',
      classification: rep.riskLevel === 'Critical' || rep.riskLevel === 'High' ? 'Threat' : rep.riskLevel === 'Guarded' ? 'Warning' : 'Normal',
      title: `Link DNA Signal: ${rep.riskLevel} Risk`,
      message: rep.verdict,
      evidence: `Risk score: ${rep.score}/100. Signals: ${linkData.linkDnaProfile.riskSignals.map(s=>s.description).join('; ')}`,
      timestamp: new Date().toISOString(),
      toolRef: 'Link DNA'
    });
  }

  return {
    target: domain,
    timestamp: new Date().toISOString(),
    signalSummary: {
      totalSignals: signals.length,
      threats: signals.filter(s => s.classification === 'Threat').length,
      warnings: signals.filter(s => s.classification === 'Warning').length,
      notices: signals.filter(s => s.classification === 'Notice').length,
      normal: signals.filter(s => s.classification === 'Normal').length,
      signals
    }
  };
}

module.exports = { generateSignalZeroTimeline };
