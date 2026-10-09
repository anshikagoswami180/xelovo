const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { validateTargetInput } = require('../middleware/ssrfGuard');
const { runUnifiedAnalysis } = require('../services/analysisEngine');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

// Import security services
const { buildExposureMap } = require('../services/exposureMapService');
const { analyzeLinkDNA } = require('../services/linkDnaService');
const { analyzeShadowSurface } = require('../services/shadowSurfaceService');
const { generateSignalZeroTimeline } = require('../services/signalZeroService');
const { analyzeSecurityHeaders } = require('../services/headerService');
const { inspectTLS } = require('../services/sslService');
const { analyzeDomainDNS } = require('../services/dnsService');
const { traceRedirects } = require('../services/redirectService');
const { analyzePrivacy } = require('../services/privacyService');
const { computeHashes, processEncoding, checkHashReputation } = require('../services/hashService');
const { inspectMetadata, cleanMetadata } = require('../services/metadataService');
const { generateAiResponse } = require('../services/aiService');

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

// Master Scan Execution Router
router.post('/execute', authenticateToken, upload.single('file'), async (req, res) => {
  const { toolId, target, authorizationConfirmed, options } = req.body;
  const userId = req.user.id;

  if (!toolId) {
    return res.status(400).json({ error: 'Tool ID is required.' });
  }

  let isAuthConfirmed = authorizationConfirmed === true || authorizationConfirmed === 'true';
  let parsedOptions = {};
  try { parsedOptions = typeof options === 'string' ? JSON.parse(options) : (options || {}); } catch(e){}

  // SSRF Protection Guard for network tools
  const networkTools = ['exposure-map', 'link-dna', 'shadow-surface', 'signal-zero', 'header-inspector', 'tls-inspector', 'domain-intelligence', 'redirect-trace', 'privacy-scanner', 'cookie-inspector', 'digital-footprint'];
  if (target && networkTools.includes(toolId)) {
    const ssrfCheck = validateTargetInput(target);
    if (!ssrfCheck.valid) {
      return res.status(400).json({ error: `Scan blocked by XELOVO SSRF Guard: ${ssrfCheck.reason}` });
    }
  }

  try {
    // Run unified real-time analysis engine probe
    const unifiedAnalysis = await runUnifiedAnalysis(toolId, target || (req.file ? req.file.originalname : 'File Assessment'), parsedOptions);
    let scanResults = unifiedAnalysis;

    switch (toolId) {
      // TOP 4 FLAGSHIP TOOLS
      case 'exposure-map':
        if (!target) return res.status(400).json({ error: 'Target domain is required.' });
        const mapData = await buildExposureMap(target, parsedOptions.orgName, parsedOptions.usernames);
        scanResults = { ...unifiedAnalysis, mapData };
        break;

      case 'link-dna':
        if (!target) return res.status(400).json({ error: 'Target URL is required.' });
        const dnaData = await analyzeLinkDNA(target);
        scanResults = { ...unifiedAnalysis, dnaData };
        break;

      case 'shadow-surface':
        if (!target) return res.status(400).json({ error: 'Target domain is required.' });
        if (!isAuthConfirmed) return res.status(403).json({ error: 'Explicit authorization confirmation is required for Shadow Surface scan.' });
        const shadowData = await analyzeShadowSurface(target, isAuthConfirmed);
        scanResults = { ...unifiedAnalysis, shadowData };
        break;

      case 'signal-zero':
        if (!target) return res.status(400).json({ error: 'Target domain is required.' });
        const signalData = await generateSignalZeroTimeline(target, parsedOptions.targetUrl);
        scanResults = { ...unifiedAnalysis, signalData };
        break;

      // OTHER FUNCTIONAL TOOLS
      case 'file-hash':
        if (req.file) {
          const hashes = computeHashes(req.file.buffer);
          scanResults = {
            ...unifiedAnalysis,
            filename: req.file.originalname,
            fileSizeBytes: req.file.size,
            hashes,
            reputation: checkHashReputation(hashes.sha256)
          };
        } else if (target) {
          scanResults = {
            ...unifiedAnalysis,
            hash: target,
            reputation: checkHashReputation(target)
          };
        } else {
          return res.status(400).json({ error: 'File upload or hash string is required.' });
        }
        break;

      case 'encoding-utility':
        if (!target) return res.status(400).json({ error: 'Input text is required.' });
        scanResults = {
          ...unifiedAnalysis,
          encoding: processEncoding(target, parsedOptions.mode || 'base64_encode')
        };
        break;

      case 'metadata-inspector':
        if (!req.file) return res.status(400).json({ error: 'File upload is required for metadata inspection.' });
        scanResults = {
          ...unifiedAnalysis,
          metadata: inspectMetadata(req.file.originalname, req.file.buffer)
        };
        break;

      case 'password-analyzer':
        if (!target) return res.status(400).json({ error: 'Password string is required.' });
        const len = target.length;
        const hasUpper = /[A-Z]/.test(target);
        const hasLower = /[a-z]/.test(target);
        const hasNum = /[0-9]/.test(target);
        const hasSpec = /[^A-Za-z0-9]/.test(target);
        
        let poolSize = 0;
        if (hasLower) poolSize += 26;
        if (hasUpper) poolSize += 26;
        if (hasNum) poolSize += 10;
        if (hasSpec) poolSize += 32;

        const entropy = Math.round(len * Math.log2(poolSize || 1));
        scanResults = {
          ...unifiedAnalysis,
          passwordTelemetry: {
            length: len,
            entropyBits: entropy,
            characterDiversity: { hasUpper, hasLower, hasNum, hasSpec },
            strength: entropy > 80 ? 'Very Strong' : entropy > 60 ? 'Strong' : entropy > 40 ? 'Moderate' : 'Weak',
            warning: 'Analysis performed 100% locally. Passwords should never be transmitted to remote servers.'
          }
        };
        break;

      default:
        break;
    }

    // Persist scan to SQLite with Analysis ID
    const scanId = unifiedAnalysis.analysisId || `scn_${generateId()}`;
    const summaryText = JSON.stringify(scanResults).substring(0, 200);

    db.prepare(`
      INSERT INTO scans (id, user_id, tool_id, target, status, summary, results_json, authorization_confirmed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(scanId, userId, toolId, target || 'File Assessment', 'completed', summaryText, JSON.stringify(scanResults), isAuthConfirmed ? 1 : 0);

    // Save to tool history
    db.prepare(`
      INSERT INTO tool_history (id, user_id, tool_id, target)
      VALUES (?, ?, ?, ?)
    `).run(generateId(), userId, toolId, target || 'File Assessment');

    // Return scan result
    res.json({
      scanId,
      analysisId: unifiedAnalysis.analysisId,
      toolId,
      target: target || 'File Assessment',
      status: 'completed',
      results: scanResults
    });

  } catch (err) {
    res.status(500).json({ error: `Scan execution failed: ${err.message}` });
  }
});

// Fetch scan history
router.get('/history', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const scans = db.prepare('SELECT id, tool_id, target, status, created_at FROM scans WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(userId);
  res.json({ scans });
});

// Fetch single scan details
router.get('/:scanId', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const scan = db.prepare('SELECT * FROM scans WHERE id = ? AND user_id = ?').get(req.params.scanId, userId);
  if (!scan) {
    return res.status(404).json({ error: 'Scan record not found.' });
  }
  res.json({
    ...scan,
    results: JSON.parse(scan.results_json || '{}')
  });
});

// XELA AI query endpoint
router.post('/ai/ask', authenticateToken, async (req, res) => {
  const { message, scanContext, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Message query is required.' });

  try {
    const aiReply = await generateAiResponse(message, scanContext, history || []);
    res.json(aiReply);
  } catch (err) {
    console.error('[XELA AI Error]', err);
    res.json({
      answer: "I experienced a temporary processing delay. Could you please rephrase or ask your question again?",
      contextUsed: false
    });
  }
});

module.exports = router;
