/**
 * XELOVO Database Connection & Schema Management Engine
 * Powered by Better-SQLite3 with Write-Ahead Logging (WAL) and versioned migrations.
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { runMigrations } = require('./migrate');

const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'xelavo.db');
const db = new Database(dbPath);

// Enable WAL mode, strict foreign key enforcement, and normal synchronous IO
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = NORMAL');

// Run version-controlled migrations
try {
  runMigrations(db);
} catch (err) {
  console.error('[XELOVO DB Migration Error]', err.message);
}

/**
 * Diagnostic health check verifying database connectivity, mode, and schema integrity
 */
function checkHealth() {
  try {
    const ping = db.prepare('SELECT 1 as alive').get();
    const journalMode = db.pragma('journal_mode', { simple: true });
    const foreignKeys = db.pragma('foreign_keys', { simple: true });
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all().map(t => t.name);
    const migrationCount = db.prepare('SELECT count(*) as count FROM _migrations').get().count;

    return {
      connected: !!(ping && ping.alive === 1),
      engine: 'SQLite 3 (better-sqlite3)',
      journalMode,
      foreignKeysEnabled: foreignKeys === 1,
      totalMigrations: migrationCount,
      tables,
      status: 'HEALTHY'
    };
  } catch (err) {
    return {
      connected: false,
      engine: 'SQLite 3 (better-sqlite3)',
      error: err.message,
      status: 'UNHEALTHY'
    };
  }
}

/**
 * Executes a callback function inside an atomic database transaction
 */
function runInTransaction(callback) {
  const tx = db.transaction(callback);
  return tx();
}

// Attach helpers directly to db instance
db.checkHealth = checkHealth;
db.runInTransaction = runInTransaction;

module.exports = db;
