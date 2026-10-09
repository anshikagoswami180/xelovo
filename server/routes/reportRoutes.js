const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

// List Reports
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const reports = db.prepare('SELECT id, title, scope, status, created_at FROM reports WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  res.json({ reports });
});

// Get Single Report
router.get('/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const report = db.prepare('SELECT * FROM reports WHERE id = ? AND user_id = ?').get(req.params.id, userId);
  if (!report) {
    return res.status(404).json({ error: 'Report not found.' });
  }
  res.json({
    ...report,
    findings: JSON.parse(report.findings_json || '[]')
  });
});

// Export Report in HTML, JSON, or Markdown format
router.get('/:id/export', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const format = (req.query.format || 'json').toLowerCase();
  const report = db.prepare('SELECT * FROM reports WHERE id = ? AND user_id = ?').get(req.params.id, userId);

  if (!report) {
    return res.status(404).json({ error: 'Report not found for export.' });
  }

  const findings = JSON.parse(report.findings_json || '[]');

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${report.id}.json"`);
    return res.json({
      reportId: report.id,
      title: report.title,
      scope: report.scope,
      createdAt: report.created_at,
      findings
    });
  }

  if (format === 'markdown' || format === 'md') {
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${report.id}.md"`);
    let md = `# XELOVO Security Analysis Report\n\n`;
    md += `**Report ID:** \`${report.id}\`  \n`;
    md += `**Target Scope:** \`${report.scope}\`  \n`;
    md += `**Generated:** \`${report.created_at}\`  \n\n`;
    md += `## Executive Summary\n${report.title}\n\n`;
    md += `## Verified Findings\n`;
    findings.forEach((f, i) => {
      md += `${i + 1}. **${f.title || f.indicator || 'Finding'}**: ${f.description || f.impact || 'Observed telemetry'}\n`;
    });
    return res.send(md);
  }

  if (format === 'html') {
    res.setHeader('Content-Type', 'text/html');
    let html = `<!DOCTYPE html><html><head><title>${report.title}</title><style>body{font-family:sans-serif;background:#030B1C;color:#F2F5F9;padding:2rem;} h1{color:#1688FF;} .card{background:#091B36;padding:1.5rem;border-radius:8px;border:1px solid #1688FF;margin-top:1rem;}</style></head><body>`;
    html += `<h1>XELOVO Security Report</h1><p>Report ID: ${report.id} | Target: ${report.scope}</p>`;
    html += `<div class="card"><h2>${report.title}</h2><ul>`;
    findings.forEach(f => {
      html += `<li><strong>${f.title || f.indicator || 'Finding'}</strong>: ${f.description || f.impact || ''}</li>`;
    });
    html += `</ul></div></body></html>`;
    return res.send(html);
  }

  res.status(400).json({ error: 'Unsupported export format. Supported formats: json, markdown, html.' });
});

// Save New Security Report
router.post('/', authenticateToken, (req, res) => {
  const { title, scope, findings } = req.body;
  const userId = req.user.id;

  if (!title || !scope) {
    return res.status(400).json({ error: 'Report title and scope are required.' });
  }

  const id = `rep_${generateId()}`;
  db.prepare(`
    INSERT INTO reports (id, user_id, title, scope, findings_json)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, userId, title, scope, JSON.stringify(findings || []));

  res.json({ id, title, scope, message: 'Security report saved successfully.' });
});

module.exports = router;
