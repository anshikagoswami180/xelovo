export function analyzeScamMessage(rawText = '') {
  const text = rawText.trim();
  if (!text || text.length < 5) {
    return {
      riskScore: 0,
      severity: 'LOW',
      assessment: 'Unable to determine with confidence from the information provided.',
      confidence: 'INSUFFICIENT_EVIDENCE',
      classifiedObservations: [{ type: 'USER_PROVIDED', text: 'Input text length is too short to evaluate scam risk indicators.' }],
      scoreBreakdown: [],
      riskIndicators: [],
      recommendedActions: ['Provide the full text message, email, or chat conversation to run pattern analysis.'],
      limitations: ['Static rule matching requires sufficient text content.'],
      networkOperations: [],
      honestDisclaimer: 'This analysis is based on detected risk indicators. XELOVO cannot guarantee that a message is legitimate or fraudulent without independent verification.'
    };
  }

  const classifiedObservations = [];
  const scoreBreakdown = [];
  const riskIndicators = [];
  const recommendedActions = [];
  const limitations = [];
  const networkOperations = [];

  let score = 0;
  const lower = text.toLowerCase();

  classifiedObservations.push({
    type: 'USER_PROVIDED',
    text: `Submitted text message length: ${text.length} characters.`
  });

  // 1. CREDENTIAL HARVESTING (+20)
  if (/password|passcode|security pin|login details|credentials/i.test(lower)) {
    scoreBreakdown.push({ indicator: 'Credential harvesting request', quote: 'password / credentials', points: 20 });
    score += 20;
  }

  // 2. OTP HARVESTING (+20)
  if (/otp|verification code|one-time pin|6-digit|code sent/i.test(lower)) {
    scoreBreakdown.push({ indicator: 'OTP harvesting request', quote: 'OTP / verification code', points: 20 });
    score += 20;
  }

  // 3. FINANCIAL DEMAND / ADVANCE FEE (+20)
  if (/fee|refundable|pay|deposit|transfer|₹[0-9]+|\$[0-9]+|zelle|crypto|bitcoin|gift card/i.test(lower) && /security|verification|processing|tax|clearance|claim/i.test(lower)) {
    scoreBreakdown.push({ indicator: 'Advance-fee / financial payment demand', quote: 'verification fee / payment', points: 20 });
    score += 20;
  } else if (/wire transfer|zelle|venmo|gift card|crypto wallet|bitcoin wallet/i.test(lower)) {
    scoreBreakdown.push({ indicator: 'Irreversible untraceable payment demand', quote: 'gift card / Zelle / Crypto', points: 20 });
    score += 20;
  }

  // 4. PAYMENT SCREENSHOT REQUEST (+10)
  if (/screenshot|payment proof|send receipt/i.test(lower)) {
    scoreBreakdown.push({ indicator: 'Payment screenshot request', quote: 'send payment screenshot', points: 10 });
    score += 10;
  }

  // 5. URGENCY / IMMEDIATE ACTION (+10)
  if (/urgent|immediately|within 30 minutes|within 1 hour|final warning|today/i.test(lower)) {
    scoreBreakdown.push({ indicator: 'Urgency / extreme time pressure', quote: 'within 30 minutes / final warning', points: 10 });
    score += 10;
  }

  // 6. ACCOUNT SUSPENSION THREAT (+10)
  if (/suspended|permanent|block|terminate|closed/i.test(lower)) {
    scoreBreakdown.push({ indicator: 'Account suspension threat', quote: 'account will be suspended', points: 10 });
    score += 10;
  }

  // 7. AUTHORITY / SECURITY IMPERSONATION (+10)
  if (/bank|official|support|security|irs|police|warrant|customs/i.test(lower)) {
    scoreBreakdown.push({ indicator: 'Authority / security impersonation', quote: 'bank / support / security', points: 10 });
    score += 10;
  }

  // 8. PRESSURE TO AVOID OFFICIAL SUPPORT (+10)
  if (/do not contact|avoid bank|do not call|do not reach out/i.test(lower)) {
    scoreBreakdown.push({ indicator: 'Pressure to avoid official support', quote: 'do not contact bank/support', points: 10 });
    score += 10;
  }

  // 9. SECRECY PRESSURE (+5)
  if (/confidential|do not share|keep secret/i.test(lower)) {
    scoreBreakdown.push({ indicator: 'Secrecy / do-not-share pressure', quote: 'confidential / do not share', points: 5 });
    score += 5;
  }

  // 10. RAW IP URL IN MESSAGE (+5) & EXPLICIT HTTP (+5)
  const urlMatch = text.match(/https?:\/\/[^\s]+/i) || text.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}[^\s]*/i);
  if (urlMatch) {
    const foundUrl = urlMatch[0];
    if (/http:\/\//i.test(foundUrl)) {
      scoreBreakdown.push({ indicator: 'Explicit HTTP URL supplied', quote: 'http://', points: 5 });
      score += 5;
    }
    if (/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/.test(foundUrl)) {
      scoreBreakdown.push({ indicator: 'Raw IP destination URL', quote: foundUrl, points: 5 });
      score += 5;

      const ipOnly = (foundUrl.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/) || [])[0];
      if (ipOnly) {
        const ipParts = ipOnly.split('.').map(Number);
        const isPrivate = (ipParts[0] === 10) || (ipParts[0] === 192 && ipParts[1] === 168) || (ipParts[0] === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) || (ipParts[0] === 127);
        if (isPrivate) {
          networkOperations.push({
            target: ipOnly,
            operation: 'HTTP Probe',
            status: 'BLOCKED',
            reason: 'Private/internal network address (SSRF Guard)',
            method: 'SSRF_BOUNDARY_CHECK',
            duration: 'NOT_AVAILABLE'
          });
        }
      }
    }
  }

  // Cap Score at 100
  score = Math.min(Math.max(score, 0), 100);

  // Deterministic Severity Scale:
  // 0-19: LOW | 20-39: MODERATE | 40-59: ELEVATED | 60-79: HIGH | 80-100: CRITICAL
  let severity = 'LOW';
  let assessment = 'No matching suspicious scam indicator was observed in the available checks.';

  if (score >= 80) {
    severity = 'CRITICAL';
    assessment = 'Multiple critical scam & advance-fee coercion indicators detected.';
  } else if (score >= 60) {
    severity = 'HIGH';
    assessment = 'High-risk scam indicators detected in message telemetry.';
  } else if (score >= 40) {
    severity = 'ELEVATED';
    assessment = 'Elevated scam indicators detected.';
  } else if (score >= 20) {
    severity = 'MODERATE';
    assessment = 'Moderate risk scam indicators identified.';
  }

  scoreBreakdown.forEach(item => {
    riskIndicators.push({
      indicator: item.indicator,
      impact: `[+${item.points} pts] Triggered by: '${item.quote}'`,
      evidence: item.quote,
      source: 'USER_PROVIDED_CONTENT',
      method: 'LOCAL_PATTERN_ANALYSIS',
      verification: 'OBSERVED'
    });
  });

  if (score >= 40) {
    recommendedActions.push('Do not transfer money, pay fees, or send gift cards/cryptocurrency.');
    recommendedActions.push('Do not provide passwords, OTP codes, or payment screenshots.');
    recommendedActions.push('Contact the named organization directly using an independently verified phone number or website.');
  } else {
    recommendedActions.push('Exercise standard caution with unsolicited messages requesting financial transactions.');
  }

  limitations.push('Static pattern rules evaluate structural language and coercion keywords.');
  limitations.push('XELOVO does not issue claims that external persons or organizations are fraudulent without independent legal verification.');

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
    honestDisclaimer: 'This assessment is based on local rule analysis of supplied content. Scores are calculated dynamically from detected evidence.'
  };
}
