const { URL } = require('url');
const { traceRedirects } = require('./redirectService');
const { inspectTLS } = require('./sslService');

async function analyzeLinkDNA(targetUrl) {
  let rawUrl = targetUrl.trim();
  if (!/^https?:\/\//i.test(rawUrl)) {
    rawUrl = `https://${rawUrl}`;
  }

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch (err) {
    return {
      url: targetUrl,
      error: `Invalid URL format: ${err.message}`,
      timestamp: new Date().toISOString()
    };
  }

  const hostname = parsed.hostname;
  const protocol = parsed.protocol;
  const path = parsed.pathname;
  const search = parsed.search;

  // 1. Structural Identity Analysis
  const isIpAddress = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
  const isPunycode = hostname.startsWith('xn--') || hostname.includes('.xn--');
  const subdomains = hostname.split('.').slice(0, -2);
  const excessiveSubdomains = subdomains.length > 3;
  const domainParts = hostname.split('.');
  const tld = domainParts.length > 1 ? domainParts[domainParts.length - 1] : '';
  
  const suspiciousTlds = ['zip', 'mov', 'top', 'xyz', 'country', 'kim', 'work', 'gq', 'cf', 'tk', 'ml', 'ga', 'fit', 'surf', 'loan'];
  const isSuspiciousTld = suspiciousTlds.includes(tld.toLowerCase());

  // Suspicious keywords in domain or path (Brand spoofing / phishing keywords)
  const phishingKeywords = ['login', 'signin', 'verify', 'update', 'account', 'banking', 'secure', 'password', 'credential', 'auth', 'wallet', 'crypto', 'support', 'billing', 'confirm', 'paypal', 'appleid', 'microsoft', 'google', 'metamask'];
  
  const foundKeywordsInDomain = phishingKeywords.filter(kw => hostname.toLowerCase().includes(kw));
  const foundKeywordsInPath = phishingKeywords.filter(kw => (path + search).toLowerCase().includes(kw));

  // URL Encoding & Obfuscation analysis
  const hasDoubleEncoding = /%25[0-9a-fA-F]{2}/.test(rawUrl);
  const hasHexIp = /0x[0-9a-fA-F]+/i.test(rawUrl);
  const hasAtSymbolInAuth = parsed.username || parsed.password || rawUrl.includes('@');

  // Homograph / Deceptive Character Check
  const nonAsciiChars = [];
  for (let i = 0; i < rawUrl.length; i++) {
    const code = rawUrl.charCodeAt(i);
    if (code > 127) nonAsciiChars.push(rawUrl[i]);
  }
  const hasHomographRisk = isPunycode || nonAsciiChars.length > 0;

  // 2. Redirect Analysis
  let redirectData = null;
  try {
    redirectData = await traceRedirects(rawUrl, 6);
  } catch (e) {
    redirectData = { error: e.message, hops: [] };
  }

  // 3. TLS Analysis
  let tlsData = null;
  if (protocol === 'https:') {
    try {
      tlsData = await inspectTLS(hostname);
    } catch (e) {
      tlsData = { valid: false, error: e.message };
    }
  }

  // Calculate Risk Score & Evidence Signals
  const riskSignals = [];
  const trustSignals = [];
  let score = 0; // 0 to 100

  if (isIpAddress) {
    riskSignals.push({ level: 'High', code: 'IP_HOSTNAME', description: 'URL uses raw IP address instead of domain name.' });
    score += 25;
  }
  if (hasHomographRisk) {
    riskSignals.push({ level: 'High', code: 'HOMOGRAPH_DECEPTION', description: 'Punycode or non-ASCII unicode characters detected in domain/URL.' });
    score += 30;
  }
  if (isSuspiciousTld) {
    riskSignals.push({ level: 'Medium', code: 'SUSPICIOUS_TLD', description: `Top-level domain (.${tld}) frequently associated with phishing campaigns.` });
    score += 15;
  }
  if (excessiveSubdomains) {
    riskSignals.push({ level: 'Medium', code: 'EXCESSIVE_SUBDOMAINS', description: `Unusual number of subdomain levels detected (${subdomains.length}).` });
    score += 15;
  }
  if (foundKeywordsInDomain.length > 0) {
    riskSignals.push({ level: 'High', code: 'BRAND_KEYWORD_DOMAIN', description: `High-risk sensitive keyword(s) found in domain: [${foundKeywordsInDomain.join(', ')}]` });
    score += 25;
  }
  if (foundKeywordsInPath.length > 0) {
    riskSignals.push({ level: 'Medium', code: 'SENSITIVE_KEYWORD_PATH', description: `Authentication / financial keyword(s) found in URL path: [${foundKeywordsInPath.join(', ')}]` });
    score += 10;
  }
  if (hasAtSymbolInAuth) {
    riskSignals.push({ level: 'High', code: 'CREDENTIAL_URL_EMBEDDING', description: 'URL contains "@" character which can deceive browsers about the real host.' });
    score += 20;
  }
  if (hasDoubleEncoding) {
    riskSignals.push({ level: 'Medium', code: 'OBFUSCATED_ENCODING', description: 'Double URL encoding detected in path parameters.' });
    score += 15;
  }
  if (redirectData && redirectData.riskIndicators && redirectData.riskIndicators.hasHttpsDowngrade) {
    riskSignals.push({ level: 'Critical', code: 'HTTPS_DOWNGRADE', description: 'Redirect chain downgrades connection from HTTPS to plain HTTP.' });
    score += 35;
  }
  if (redirectData && redirectData.riskIndicators && redirectData.riskIndicators.domainChanges > 1) {
    riskSignals.push({ level: 'Medium', code: 'CROSS_DOMAIN_REDIRECT', description: `Redirects across ${redirectData.riskIndicators.domainChanges} different external domains.` });
    score += 15;
  }

  // Trust Signals
  if (protocol === 'https:') {
    trustSignals.push({ code: 'HTTPS_ENABLED', description: 'Enforces encrypted HTTPS protocol.' });
  }
  if (tlsData && tlsData.valid && !tlsData.isSelfSigned && tlsData.daysRemaining > 30) {
    trustSignals.push({ code: 'VALID_TLS_CERT', description: `Valid TLS certificate issued by ${tlsData.issuer.organization || tlsData.issuer.commonName}.` });
  }
  if (!isIpAddress && !isPunycode && subdomains.length <= 1) {
    trustSignals.push({ code: 'STANDARD_DOMAIN_STRUCTURE', description: 'Standard domain depth and naming structure.' });
  }

  // Final Risk Rating Determination
  let riskLevel = 'Safe';
  if (score >= 60 || riskSignals.some(s => s.level === 'Critical')) {
    riskLevel = 'Critical';
  } else if (score >= 40 || riskSignals.filter(s => s.level === 'High').length >= 1) {
    riskLevel = 'High';
  } else if (score >= 25) {
    riskLevel = 'Guarded';
  } else if (score >= 10) {
    riskLevel = 'Low';
  }

  const hasPhishingIndicators = riskSignals.length > 0;

  return {
    url: rawUrl,
    timestamp: new Date().toISOString(),
    linkDnaProfile: {
      identity: {
        hostname,
        protocol,
        tld,
        subdomains,
        isIpAddress,
        isPunycode,
        homographRisk: hasHomographRisk
      },
      path: {
        pathname: path,
        query: search,
        length: rawUrl.length,
        hasObfuscation: hasDoubleEncoding || hasHexIp
      },
      redirectBehavior: {
        totalHops: redirectData ? redirectData.totalHops || 1 : 1,
        finalDestination: redirectData ? redirectData.finalDestination || rawUrl : rawUrl,
        domainChanges: redirectData && redirectData.riskIndicators ? redirectData.riskIndicators.domainChanges : 0
      },
      trustSignals,
      riskSignals,
      reputation: {
        score: Math.min(score, 100),
        riskLevel,
        verdict: hasPhishingIndicators ? 'Potential phishing indicators detected' : 'No suspicious link indicators identified'
      }
    }
  };
}

module.exports = { analyzeLinkDNA };
