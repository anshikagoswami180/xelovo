const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const intelligenceRoutes = require('./routes/intelligenceRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');
const db = require('./db');

const { apiLimiter, scanLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Hardening: Disable Express fingerprint
app.disable('x-powered-by');

// Security & CORS Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom OWASP Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Rate Limiting
app.use('/api/', apiLimiter);
app.use('/api/scans/execute', scanLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/user', userRoutes);

// Health Check & Diagnostic Inspection
app.get('/api/health', (req, res) => {
  const dbHealth = db.checkHealth ? db.checkHealth() : { connected: true, status: 'ONLINE' };
  res.json({
    status: 'XELOVO Core Engine Online',
    brand: 'XELOVO',
    tagline: 'See Threats. Know More. Stay Protected.',
    version: '1.1.0-Production',
    database: dbHealth,
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build in production
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
if (require('fs').existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[XELOVO CORE] Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

