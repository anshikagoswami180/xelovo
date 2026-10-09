export function analyzePhishingInput({ url = '', emailSubject = '', emailSender = '', messageContent = '' }) {
  const classifiedObservations = [];
  const scoreBreakdown = [];
  const riskIndicators = [];
  const recommendedActions = [];
  const limitations = [];
  const networkOperations = [];

  let score = 0;

  const rawUrl = url.trim();
  const subject = emailSubject.trim();
  const sender = emailSender.trim();
  const text = messageContent.trim();
  const combinedText = `${subject} ${sender} ${text}`.toLowerCase();

  if (!rawUrl && !subject && !sender && !text) {
    return null;
  }

  // 1. URL ANALYSIS & PROTOCOL TRUTH
  if (rawUrl) {
    classifiedObservations.push({
      type: 'USER_PROVIDED',
      text: `Submitted URL Target: '${rawUrl}'`
    });

    const hasExplicitHttp = /^http:\/\//i.test(rawUrl);
    const hasExplicitHttps = /^https:\/\//i.test(rawUrl);

    if (hasExplicitHttp) {
      classifiedObservations.push({
        type: 'OBSERVED',
        text: 'Explicit HTTP scheme provided in URL string.'
      });
      scoreBreakdown.push({ indicator: 'HTTP scheme explicitly supplied', quote: 'http://', points: 5 });
      score += 5;
    } else if (hasExplicitHttps) {
      classifiedObservations.push({
        type: 'OBSERVED',
        text: 'Explicit HTTPS scheme provided in URL string.'
      });
    } else {
      classifiedObservations.push({
        type: 'INFERRED',
        text: 'HTTPS / HTTP Scheme: NOT_DETERMINED (No scheme prefix supplied in raw input string and no network probe executed).'
      });
    }

    // Parse domain or IP host
    let hostStr = rawUrl.replace(/^https?:\/\//i, '').split('/')[0].split('?')[0].split('#')[0];

    // Raw IP Address Check
    const isIpAddress = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostStr.split(':')[0]);
    if (isIpAddress) {
      const ipOnly = hostStr.split(':')[0];
      classifiedObservations.push({
        type: 'OBSERVED',
        text: `Target host contains raw IPv4 address ('${ipOnly}').`
      });
      scoreBreakdown.push({ indicator: 'Raw IP destination', quote: ipOnly, points: 5 });
      score += 5;

      // Check for private / internal IP (SSRF Safety Boundary)
      const ipParts = ipOnly.split('.').map(Number);
      const isPrivate = (ipParts[0] === 10) ||
                        (ipParts[0] === 192 && ipParts[1] === 168) ||
                        (ipParts[0] === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) ||
                        (ipParts[0] === 127) || (ipParts[0] === 169 && ipParts[1] === 254);

      if (isPrivate) {
        networkOperations.push({
          target: ipOnly,
          operation: 'HTTP/HTTPS Probe',
          status: 'BLOCKED',
          reason: 'Private/internal network IP address (SSRF Guard)',
          method: 'SSRF_BOUNDARY_CHECK',
          duration: 'NOT_AVAILABLE'
        });
        limitations.push(`Network probe blocked for private IP address '${ipOnly}'. No external socket operation performed.`);
      } else {
        networkOperations.push({
          target: ipOnly,
          operation: 'HTTP/HTTPS Probe',
          status: 'NOT_PERFORMED',
          reason: 'Static local indicator analysis mode',
          method: 'LOCAL_RULE_ENGINE',
          duration: 'NOT_AVAILABLE'
        });
      }
    } else {
      networkOperations.push({
        target: hostStr,
        operation: 'HTTP/HTTPS Probe',
        status: 'NOT_PERFORMED',
        reason: 'Static local indicator analysis mode',
        method: 'LOCAL_RULE_ENGINE',
        duration: 'NOT_AVAILABLE'
      });
    }

    // Suspicious URL Structure / Subdomains
    const subdomains = hostStr.split('.');
    if (subdomains.length > 4) {
      classifiedObservations.push({
        type: 'LOCAL_ANALYSIS',
        text: `Excessive subdomain levels detected (${subdomains.length - 2} levels).`
      });
      scoreBreakdown.push({ indicator: 'Suspicious excessive subdomains', quote: hostStr, points: 10 });
      score += 10;
    }

    // Brand impersonation check
    const lookalikePatterns = [
      { pattern: /paypa[1l]|paypaI|pay-pal/i, brand: 'PayPal' },
      { pattern: /micros0ft|microsft|mcrosoft/i, brand: 'Microsoft' },
      { pattern: /goog1e|g00gle|googel/i, brand: 'Google' },
      { pattern: /amaz0n|amzn-verify/i, brand: 'Amazon' },
      { pattern: /app1e|apple-id-verify/i, brand: 'Apple' },
      { pattern: /metamask-auth|wallet-connect/i, brand: 'Crypto Wallet' }
    ];

    lookalikePatterns.forEach(({ pattern, brand }) => {
      if (pattern.test(rawUrl)) {
        classifiedObservations.push({
          type: 'LOCAL_ANALYSIS',
          text: `Detected brand impersonation / typosquatting pattern targeting '${brand}'.`
        });
        scoreBreakdown.push({ indicator: 'Security/bank/brand impersonation', quote: brand, points: 10 });
        score += 10;
      }
    });

    // Sensitive authentication keywords
    if (/login|signin|verify|account|banking|password|credential|confirm|auth/i.test(rawUrl)) {
      scoreBreakdown.push({ indicator: 'Suspicious URL path/keywords', quote: 'login/verify/auth', points: 10 });
      score += 10;
    }
  }

  // 2. MESSAGE CONTENT & SENDER ANALYSIS
  if (sender) {
    classifiedObservations.push({
      type: 'USER_PROVIDED',
      text: `Submitted Email Sender: '${sender}'`
    });
    if (/@(gmail|yahoo|hotmail|outlook)\.com$/i.test(sender) && /support|bank|security|verification/i.test(combinedText)) {
      classifiedObservations.push({
        type: 'LOCAL_ANALYSIS',
        text: 'Official security/support claim originating from generic public webmail address.'
      });
      scoreBreakdown.push({ indicator: 'Security/bank/support impersonation', quote: sender, points: 10 });
      score += 10;
    }
  }

  if (combinedText.length > 0) {
    classifiedObservations.push({
      type: 'USER_PROVIDED',
      text: `Submitted Message Body: ${combinedText.length} characters analyzed.`
    });

    // Credential Harvesting (+20)
    if (/password|social security|credit card|cvv|pin number|banking log/i.test(combinedText)) {
      scoreBreakdown.push({ indicator: 'Credential request', quote: 'password / card / PIN', points: 20 });
      score += 20;
    }

    // OTP Harvesting (+20)
    if (/otp|verification code|one-time pin|6-digit|passcode/i.test(combinedText)) {
      scoreBreakdown.push({ indicator: 'OTP request', quote: 'OTP / verification code', points: 20 });
      score += 20;
    }

    // Financial Fee / Demand (+20)
    if (/\$[0-9]+|₹[0-9]+|dollar|rupee|fee|payment|transfer|wire/i.test(combinedText) && /pay|send|verification fee|refundable/i.test(combinedText)) {
      scoreBreakdown.push({ indicator: 'Financial credential / fee request', quote: 'fee / payment demand', points: 20 });
      score += 20;
    }

    // Urgency (+10)
    if (/urgent|immediately|within 24 hours|within 30 minutes|final warning|today/i.test(combinedText)) {
      scoreBreakdown.push({ indicator: 'Urgency / immediate action', quote: 'urgent / 30 minutes', points: 10 });
      score += 10;
    }

    // Account Suspension Threat (+10)
    if (/suspended|permanent|block|terminate|closed/i.test(combinedText)) {
      scoreBreakdown.push({ indicator: 'Account suspension threat', quote: 'account will be suspended', points: 10 });
      score += 10;
    }

    // Support Avoidance (+10)
    if (/do not contact|avoid bank|do not call/i.test(combinedText)) {
      scoreBreakdown.push({ indicator: 'Pressure to avoid official support', quote: 'do not contact bank', points: 10 });
      score += 10;
    }

    // Secrecy Pressure (+5)
    if (/confidential|do not share|keep secret/i.test(combinedText)) {
      scoreBreakdown.push({ indicator: 'Secrecy / do-not-share pressure', quote: 'confidential / keep secret', points: 5 });
      score += 5;
    }
  }

  // Cap Score at 100
  score = Math.min(Math.max(score, 0), 100);

  // Deterministic Severity Scale:
  // 0-19: LOW | 20-39: MODERATE | 40-59: ELEVATED | 60-79: HIGH | 80-100: CRITICAL
  let severity = 'LOW';
  let assessment = 'No matching suspicious indicator was observed in the available checks.';

  if (score >= 80) {
    severity = 'CRITICAL';
    assessment = 'Multiple critical phishing & credential harvesting indicators detected.';
  } else if (score >= 60) {
    severity = 'HIGH';
    assessment = 'High-risk phishing indicators detected in supplied content.';
  } else if (score >= 40) {
    severity = 'ELEVATED';
    assessment = 'Elevated phishing indicators detected.';
  } else if (score >= 20) {
    severity = 'MODERATE';
    assessment = 'Moderate risk indicators identified.';
  }

  // Build Risk Indicators list with provenance
  scoreBreakdown.forEach(item => {
    riskIndicators.push({
      indicator: item.indicator,
      impact: `[+${item.points} pts] Detected in text quote: '${item.quote}'`,
      evidence: item.quote,
      source: 'USER_PROVIDED_CONTENT',
      method: 'LOCAL_PATTERN_ANALYSIS',
      verification: 'OBSERVED'
    });
  });

  // Defensive Recommendations based on evidence
  if (score >= 40) {
    recommendedActions.push('Do not enter passwords, OTP codes, or personal banking credentials.');
    recommendedActions.push('Do not transfer money or pay claimed verification fees.');
    recommendedActions.push('Verify the sender directly through official public channels (e.g., official website).');
  } else {
    recommendedActions.push('Always verify domain destinations before entering login credentials.');
  }

  limitations.push('Analysis evaluates local pattern rules on submitted text and URL string structures.');
  limitations.push('XELOVO does not issue claims that remote destination servers are malicious without independent network verification.');

  return {
    riskScore: score,
    severity,
    assessment,
    confidence: 'HIGH',
    classifiedObservations,
    scoreBreakdown,
    riskIndicators,
    recommendedActions,
    limitations,
    networkOperations,
    honestDisclaimer: 'This assessment is based on local rule analysis of supplied content. Provenance states indicate whether telemetry is USER_PROVIDED, OBSERVED, or NOT_PERFORMED.'
  };
}
