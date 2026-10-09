const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Notifications
router.get('/notifications', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').all(userId);
  res.json({ notifications });
});

router.post('/notifications/mark-read', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(userId);
  res.json({ success: true });
});

// Audit Logs
router.get('/audit-logs', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const logs = db.prepare('SELECT * FROM audit_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50').all(userId);
  res.json({ logs });
});

module.exports = router;
