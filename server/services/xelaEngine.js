/**
 * XELA Unified Intelligence Engine Orchestrator
 * Connects RequestRouter, ContextManager, ToolRegistry, and AiProvider
 * into a single authoritative pipeline.
 */

const ContextManager = require('./contextManager');
const RequestRouter = require('./requestRouter');
const { getToolById } = require('./toolRegistry');
const AiProvider = require('./aiProvider');

class XelaEngine {
  /**
   * Main entry point for processing all user requests to XELA AI
   */
  static async processUserRequest({ message, scanContext = null, history = [] }) {
    if (!message || typeof message !== 'string') {
      return {
        type: 'error',
        answer: 'Empty or invalid user request.',
        contextUsed: false
      };
    }

    // 1. Build Context Payload
    const contextPayload = ContextManager.buildContextPayload({
      userMessage: message,
      scanContext,
      history
    });

    // 2. Semantic Intent & Request Routing
    const routedRequest = RequestRouter.routeRequest(message, contextPayload.activeInvestigation);

    let toolsExecuted = [];

    // 3. Tool Execution if required
    if (routedRequest.intent === 'TOOL_EXECUTION_REQUEST' && routedRequest.target && routedRequest.requiredTool) {
      const toolDef = getToolById(routedRequest.requiredTool);
      if (toolDef) {
        try {
          const toolResult = await toolDef.execute({ target: routedRequest.target });
          toolsExecuted.push(toolResult);

          // Update active investigation state with live tool result
          contextPayload.activeInvestigation = {
            analysisId: `XEL-LIVE-${Date.now().toString(36).toUpperCase()}`,
            target: toolResult.target,
            toolId: toolResult.tool,
            evidence: toolResult.evidence,
            riskIndicators: toolResult.findings,
            limitations: toolResult.limitations
          };
        } catch (err) {
          console.error(`[XELA Engine] Tool Execution Error (${routedRequest.requiredTool}):`, err.message);
          return {
            type: 'error',
            answer: `XELA attempted to inspect \`${routedRequest.target}\` using the **${toolDef.name}**, but execution was blocked or failed: ${err.message}`,
            contextUsed: false,
            toolsUsed: [routedRequest.requiredTool]
          };
        }
      }
    }

    // 4. AI Provider Reasoning Pass
    const aiResponse = await AiProvider.generateResponse({
      prompt: contextPayload.userMessage,
      contextPayload,
      activeInvestigation: contextPayload.activeInvestigation,
      toolsExecuted
    });

    return {
      type: aiResponse.type || 'answer',
      answer: aiResponse.answer,
      contextUsed: aiResponse.contextUsed || false,
      toolsUsed: toolsExecuted.map(t => t.tool),
      evidence: aiResponse.evidence || [],
      confidence: toolsExecuted.length > 0 ? 0.98 : (contextPayload.activeInvestigation ? 0.92 : 0.85),
      limitations: contextPayload.activeInvestigation?.limitations || []
    };
  }
}

module.exports = XelaEngine;
