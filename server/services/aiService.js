/**
 * XELA AI Service Bridge
 * Delegates all requests to the unified XelaEngine orchestrator.
 */

const XelaEngine = require('./xelaEngine');

async function generateAiResponse(userMessage, scanContext = null, history = []) {
  return await XelaEngine.processUserRequest({ message: userMessage, scanContext, history });
}

module.exports = {
  generateAiResponse,
  processUserRequest: (params) => XelaEngine.processUserRequest(params)
};
