/**
 * XELA Context Manager
 * Handles conversation history, active investigation state, user instructions,
 * context window trimming, and memory resolution.
 */

class ContextManager {
  /**
   * Builds a normalized, sanitized context payload for XELA reasoning passes.
   */
  static buildContextPayload({ userMessage, scanContext = null, history = [] }) {
    const sanitizedHistory = Array.isArray(history) 
      ? history.filter(h => h && typeof h.text === 'string').slice(-8) 
      : [];

    // Extract user instructions from userMessage
    const instructions = ContextManager.extractUserInstructions(userMessage);

    // Active investigation resolution
    let activeInvestigation = null;
    if (scanContext && typeof scanContext === 'object') {
      activeInvestigation = {
        analysisId: scanContext.analysisId || scanContext.scanId || 'XEL-ACTIVE-SCAN',
        target: scanContext.target || scanContext.input || null,
        toolId: scanContext.toolId || scanContext.tool || null,
        evidence: scanContext.evidence || [],
        riskIndicators: scanContext.riskIndicators || scanContext.findings || [],
        limitations: scanContext.limitations || []
      };
    }

    // Prior topic extraction from recent chat history
    const priorTopic = ContextManager.resolvePriorTopic(sanitizedHistory);

    return {
      userMessage: userMessage.trim(),
      sanitizedHistory,
      activeInvestigation,
      instructions,
      priorTopic
    };
  }

  /**
   * Resolves explicit user instructions (length, tone, formatting, actions)
   */
  static extractUserInstructions(text) {
    const lower = text.toLowerCase();
    return {
      isOneSentence: lower.includes('one sentence') || lower.includes('single sentence') || lower.includes('in 1 sentence'),
      isShort: lower.includes('shorter') || lower.includes('brief') || lower.includes('succinct') || lower.includes('keep it short'),
      isDetailed: lower.includes('go deeper') || lower.includes('explain deeply') || lower.includes('detailed') || lower.includes('in-depth') || lower.includes('deep dive'),
      isSimple: lower.includes('like i\'m 10') || lower.includes('like im 10') || lower.includes('simple') || lower.includes('beginner'),
      isTable: lower.includes('table') || lower.includes('in a table') || lower.includes('matrix'),
      isReport: lower.includes('report') || lower.includes('advisory') || lower.includes('write a report'),
      isTranslate: lower.includes('translate') || lower.includes('to english'),
      isSummarize: lower.includes('summarize') || lower.includes('summary'),
      isRewrite: lower.includes('rewrite') || lower.includes('professional wording')
    };
  }

  /**
   * Resolves subject memory from recent user/assistant turns
   */
  static resolvePriorTopic(history) {
    if (!history || history.length === 0) return null;
    const lastUserMsgs = history.filter(h => h.sender === 'user');
    if (lastUserMsgs.length === 0) return null;

    const recentCombined = lastUserMsgs.map(m => m.text.toLowerCase()).join(' ');

    if (recentCombined.includes('phishing')) return 'phishing';
    if (recentCombined.includes('dns')) return 'dns';
    if (recentCombined.includes('tcp') || recentCombined.includes('udp')) return 'tcp_udp';
    if (recentCombined.includes('hsts') || recentCombined.includes('csp')) return 'headers';
    if (recentCombined.includes('code') || recentCombined.includes('python') || recentCombined.includes('error')) return 'coding';
    if (recentCombined.includes('career') || recentCombined.includes('study plan') || recentCombined.includes('learn')) return 'career';

    return null;
  }
}

module.exports = ContextManager;
