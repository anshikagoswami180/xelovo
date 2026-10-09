/**
 * XELA Request Router
 * Semantic intent classification, task routing, target extraction,
 * and tool requirement detection engine.
 */

class RequestRouter {
  static routeRequest(userMessage, activeInvestigation = null) {
    const lower = userMessage.trim().toLowerCase();

    // Target domain / URL / IP extraction regex
    const targetRegex = /(https?:\/\/[^\s]+|([a-z0-9-]+\.)+[a-z]{2,}|[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|localhost)/i;
    const targetMatch = userMessage.match(targetRegex);
    let extractedTarget = targetMatch ? targetMatch[0] : null;

    if (extractedTarget && ['tcp.udp'].includes(extractedTarget.toLowerCase()) && !lower.includes('check ') && !lower.includes('scan ') && !lower.includes('inspect ')) {
      extractedTarget = null;
    }

    // 1. TOOL EXECUTION REQUEST DETECTION
    if (extractedTarget && (lower.startsWith('check ') || lower.startsWith('scan ') || lower.startsWith('inspect ') || lower.includes('check security headers') || lower.includes('inspect tls') || lower.includes('trace url') || lower.includes('check headers'))) {
      let suggestedTool = 'header-inspector';
      if (lower.includes('tls') || lower.includes('ssl') || lower.includes('certificate')) suggestedTool = 'tls-inspector';
      else if (lower.includes('dns') || lower.includes('records') || lower.includes('whois')) suggestedTool = 'domain-intelligence';
      else if (lower.includes('redirect') || lower.includes('hop')) suggestedTool = 'redirect-trace';
      else if (lower.includes('privacy') || lower.includes('tracker')) suggestedTool = 'privacy-scanner';
      else if (lower.includes('link') || lower.includes('typosquatting')) suggestedTool = 'link-dna';

      return {
        intent: 'TOOL_EXECUTION_REQUEST',
        target: extractedTarget,
        requiredTool: suggestedTool
      };
    }

    // 2. ACTIVE INVESTIGATION TELEMETRY QUERY
    const isAskingTelemetry = lower.includes('scan') || lower.includes('finding') || lower.includes('evidence') || lower.includes('risk') || lower.includes('unverified') || lower.includes('telemetry') || lower.includes('result');
    if (activeInvestigation && (isAskingTelemetry || lower.includes('what did you find') || lower.includes('target'))) {
      return {
        intent: 'INVESTIGATION_QUERY',
        target: activeInvestigation.target,
        toolId: activeInvestigation.toolId
      };
    }

    // 3. GREETING & POLITENESS
    if (lower === 'hello' || lower === 'hi' || lower === 'hey' || lower.startsWith('hello ') || lower.startsWith('hi ') || lower.includes('who are you') || lower.includes('what can you do')) {
      return { intent: 'GREETING_OR_IDENTITY' };
    }

    if (lower.startsWith('thanks') || lower.startsWith('thank you') || lower === 'okay' || lower === 'ok' || lower === 'yes' || lower === 'no') {
      return { intent: 'CASUAL_ACK' };
    }

    // 4. CONVERSATIONAL FOLLOW-UP / REWRITE
    if (lower === 'give me an example' || lower.includes('an example') || lower.includes('how do i detect') || lower.includes('explain that again') || lower.includes('make that simpler') || lower.includes('summarize that')) {
      return { intent: 'FOLLOW_UP_MEMORY' };
    }

    // 5. GENERAL KNOWLEDGE / TECHNICAL QUERY
    return {
      intent: 'GENERAL_KNOWLEDGE'
    };
  }
}

module.exports = RequestRouter;
