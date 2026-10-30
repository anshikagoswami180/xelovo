/**
 * XELOVO Database Migration Runner
 * Executes idempotent, version-controlled SQL migrations in sequence.
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

function runMigrations(dbInstance = null) {
  const dbDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = path.join(dbDir, 'xelavo.db');
  const db = dbInstance || new Database(dbPath);

  // Enable WAL mode & foreign key constraints
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('synchronous = NORMAL');

  // Tracking table for applied migrations
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const migrationsDir = path.join(__dirname, 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    return { applied: [], current: 0 };
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  const appliedList = [];

  const getApplied = db.prepare('SELECT name FROM _migrations WHERE name = ?');
  const recordMigration = db.prepare('INSERT INTO _migrations (name) VALUES (?)');

  for (const file of files) {
    const isApplied = getApplied.get(file);
    if (!isApplied) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      const executeInTx = db.transaction(() => {
        db.exec(sql);
        recordMigration.run(file);
      });

      executeInTx();
      appliedList.push(file);
    }
  }

  const totalApplied = db.prepare('SELECT count(*) as count FROM _migrations').get().count;

  return {
    applied: appliedList,
    totalApplied,
    allFiles: files
  };
}

if (require.main === module) {
  try {
    const result = runMigrations();
    console.log('[XELOVO Database Migrations]');
    if (result.applied.length > 0) {
      console.log(`Successfully applied ${result.applied.length} migration(s):`, result.applied.join(', '));
    } else {
      console.log(`Database schema is already up to date (${result.totalApplied} total migrations applied).`);
    }
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

module.exports = { runMigrations };
