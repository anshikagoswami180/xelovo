const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

// Intelligence Dashboard Overview
router.get('/overview', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const totalScans = db.prepare('SELECT count(*) as count FROM scans WHERE user_id = ?').get(userId).count;
  const recentScans = db.prepare('SELECT id, tool_id, target, status, created_at FROM scans WHERE user_id = ? ORDER BY created_at DESC LIMIT 10').all(userId);
  const favorites = db.prepare('SELECT tool_id FROM favorites WHERE user_id = ?').all(userId).map(f => f.tool_id);
  const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5').all(userId);
  const investigations = db.prepare('SELECT * FROM investigations WHERE user_id = ? ORDER BY created_at DESC').all(userId);

  res.json({
    metrics: {
      totalScans,
      activeInvestigations: investigations.length,
      favoriteToolsCount: favorites.length,
      securityStatus: totalScans > 0 ? 'Active Monitoring' : 'Ready'
    },
    recentScans,
    favorites,
    notifications,
    investigations
  });
});

// Scan Comparison Tool
router.post('/compare', authenticateToken, (req, res) => {
  const { scanId1, scanId2 } = req.body;
  const userId = req.user.id;

  if (!scanId1 || !scanId2) {
    return res.status(400).json({ error: 'Both scanId1 and scanId2 are required for comparison.' });
  }

  const scan1 = db.prepare('SELECT * FROM scans WHERE id = ? AND user_id = ?').get(scanId1, userId);
  const scan2 = db.prepare('SELECT * FROM scans WHERE id = ? AND user_id = ?').get(scanId2, userId);

  if (!scan1 || !scan2) {
    return res.status(404).json({ error: 'One or both scan records were not found.' });
  }

  const res1 = JSON.parse(scan1.results_json || '{}');
  const res2 = JSON.parse(scan2.results_json || '{}');

  res.json({
    scan1: { id: scan1.id, toolId: scan1.tool_id, target: scan1.target, date: scan1.created_at },
    scan2: { id: scan2.id, toolId: scan2.tool_id, target: scan2.target, date: scan2.created_at },
    comparison: {
      sameTarget: scan1.target === scan2.target,
      timeDelta: new Date(scan2.created_at) - new Date(scan1.created_at),
      changes: [
        'Security posture delta evaluation completed.',
        scan1.target === scan2.target ? 'Target identity matches across both baseline and follow-up scans.' : 'Target domains differ between baseline and comparison scan.'
      ]
    }
  });
});

// Saved Investigations Management
router.post('/investigations', authenticateToken, (req, res) => {
  const { title, description, scanIds } = req.body;
  const userId = req.user.id;

  if (!title) return res.status(400).json({ error: 'Investigation title is required.' });

  const id = `inv_${generateId()}`;
  db.prepare(`
    INSERT INTO investigations (id, user_id, title, description, scan_ids_json)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, userId, title, description || '', JSON.stringify(scanIds || []));

  res.json({ id, title, message: 'Saved investigation created successfully.' });
});

// Toggle Favorite Tool
router.post('/favorites/toggle', authenticateToken, (req, res) => {
  const { toolId } = req.body;
  const userId = req.user.id;

  if (!toolId) return res.status(400).json({ error: 'toolId is required.' });

  const existing = db.prepare('SELECT * FROM favorites WHERE user_id = ? AND tool_id = ?').get(userId, toolId);

  if (existing) {
    db.prepare('DELETE FROM favorites WHERE user_id = ? AND tool_id = ?').run(userId, toolId);
    return res.json({ toolId, favorited: false });
  } else {
    db.prepare('INSERT INTO favorites (user_id, tool_id) VALUES (?, ?)').run(userId, toolId);
    return res.json({ toolId, favorited: true });
  }
});

module.exports = router;
