/**
 * XELOVO Centralized Security Audit Logging Service
 * Records security-sensitive operations (authentication, scans, report creation) to audit_logs.
 */

const db = require('../db');

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function logAuditEvent({ userId = null, action, target = null, ipAddress = null }) {
  if (!action) return;
  try {
    const id = `aud_${generateId()}`;
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, target, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, userId, action, target, ipAddress);
  } catch (err) {
    console.error('[XELOVO Audit Log Error]', err.message);
  }
}

module.exports = { logAuditEvent };
