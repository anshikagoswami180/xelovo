const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

// Seed default demo account if users table is empty
function seedDemoUser() {
  const count = db.prepare('SELECT count(*) as cnt FROM users').get().cnt;
  if (count === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('xelavo2026', salt);
    const demoId = 'usr_demo_analyst';
    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(demoId, 'analyst@xelovo.io', hash, 'Security Analyst', 'lead_analyst');

    // Create default welcome notification
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type)
      VALUES (?, ?, ?, ?, ?)
    `).run(generateId(), demoId, 'Welcome to XELOVO', 'Platform initialized. 18 Security Intelligence tools ready for authorized investigation.', 'success');
  }
}
seedDemoUser();

// Register
router.post('/register', async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'All fields (email, password, fullName) are required.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const userId = `usr_${generateId()}`;

  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, email.toLowerCase(), passwordHash, fullName, 'analyst');

  const token = jwt.sign({ userId, email: email.toLowerCase() }, JWT_SECRET, { expiresIn: '7d' });

  // Log audit event
  db.prepare(`
    INSERT INTO audit_logs (id, user_id, action, target, ip_address)
    VALUES (?, ?, ?, ?, ?)
  `).run(generateId(), userId, 'USER_REGISTERED', email, req.ip);

  res.json({
    token,
    user: { id: userId, email: email.toLowerCase(), fullName, role: 'analyst' }
  });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  // Audit log
  db.prepare(`
    INSERT INTO audit_logs (id, user_id, action, target, ip_address)
    VALUES (?, ?, ?, ?, ?)
  `).run(generateId(), user.id, 'USER_LOGGED_IN', user.email, req.ip);

  res.json({
    token,
    user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role }
  });
});

// Current User Profile
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
