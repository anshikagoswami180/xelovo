/**
 * XELOVO Automated Verification & Test Suite
 * Executes unit, integration, and security regression tests across all core platform services.
 */

const assert = require('assert');
const { validateTargetInput } = require('../server/middleware/ssrfGuard');
const { computeHashes, processEncoding } = require('../server/services/hashService');
const { generateSecurityHeaderConfigs } = require('../server/services/securityHeaderGeneratorService');
const { generateAnalysisId, computeReportHash, runUnifiedAnalysis } = require('../server/services/analysisEngine');
const db = require('../server/db');
const { logAuditEvent } = require('../server/services/auditService');
const { createRateLimiter } = require('../server/middleware/rateLimiter');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
    failedTests++;
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
    failedTests++;
  }
}

async function main() {
  console.log('================================================================');
  console.log('       XELOVO PLATFORM AUTOMATED VERIFICATION TEST SUITE        ');
  console.log('================================================================\n');

  // ---------------------------------------------------------
  // SUITE 1: SSRF Guard Security Defenses
  // ---------------------------------------------------------
  console.log('▶ SUITE 1: SSRF Guard Boundary Defenses');

  runTest('Blocks IPv4 Loopback (127.0.0.1)', () => {
    const res = validateTargetInput('127.0.0.1');
    assert.strictEqual(res.valid, false);
    assert.ok(res.reason.includes('restricted'));
  });

  runTest('Blocks Localhost hostname', () => {
    const res = validateTargetInput('http://localhost:3000/api');
    assert.strictEqual(res.valid, false);
  });

  runTest('Blocks AWS/GCP Link-Local Cloud Metadata (169.254.169.254)', () => {
    const res = validateTargetInput('http://169.254.169.254/latest/meta-data/');
    assert.strictEqual(res.valid, false);
  });

  runTest('Blocks RFC 1918 Private Class A (10.0.0.5)', () => {
    const res = validateTargetInput('10.0.0.5');
    assert.strictEqual(res.valid, false);
  });

  runTest('Blocks RFC 1918 Private Class B (172.16.1.100)', () => {
    const res = validateTargetInput('172.16.1.100');
    assert.strictEqual(res.valid, false);
  });

  runTest('Blocks RFC 1918 Private Class C (192.168.1.1)', () => {
    const res = validateTargetInput('http://192.168.1.1/admin');
    assert.strictEqual(res.valid, false);
  });

  runTest('Blocks Obfuscated Hexadecimal IP (0x7f000001)', () => {
    const res = validateTargetInput('0x7f000001');
    assert.strictEqual(res.valid, false);
  });

  runTest('Blocks Obfuscated Dword Decimal IP (2130706433)', () => {
    const res = validateTargetInput('2130706433');
    assert.strictEqual(res.valid, false);
  });

  runTest('Blocks Internal Cloud DNS Names (*.internal, *.local)', () => {
    const res1 = validateTargetInput('metadata.google.internal');
    const res2 = validateTargetInput('service.local');
    assert.strictEqual(res1.valid, false);
    assert.strictEqual(res2.valid, false);
  });

  runTest('Allows Clean Public Domain (example.com)', () => {
    const res = validateTargetInput('example.com');
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.hostname, 'example.com');
  });

  runTest('Allows Clean Public HTTPS URL (https://example.com/test)', () => {
    const res = validateTargetInput('https://example.com/test');
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.hostname, 'example.com');
  });

  // ---------------------------------------------------------
  // SUITE 2: Cryptography & Hash Utility Suite
  // ---------------------------------------------------------
  console.log('\n▶ SUITE 2: Cryptographic Hash & Transformation Engine');

  runTest('Computes Accurate SHA-256 Digest', () => {
    const text = 'XELOVO_CYBERSECURITY_2026';
    const hashes = computeHashes(text);
    assert.strictEqual(hashes.sha256.length, 64);
    assert.strictEqual(hashes.sha1.length, 40);
    assert.strictEqual(hashes.md5.length, 32);
    assert.strictEqual(hashes.sha512.length, 128);
  });

  runTest('Base64 Encoding and Decoding Inversion', () => {
    const input = 'Secure Investigation Telemetry';
    const encoded = processEncoding(input, 'base64_encode');
    const decoded = processEncoding(encoded.result, 'base64_decode');
    assert.strictEqual(decoded.result, input);
  });

  runTest('URL Encoding and Decoding Inversion', () => {
    const input = 'https://example.com/search?q=test scan&id=1#frag';
    const encoded = processEncoding(input, 'url_encode');
    const decoded = processEncoding(encoded.result, 'url_decode');
    assert.strictEqual(decoded.result, input);
  });

  // ---------------------------------------------------------
  // SUITE 3: Security Header Generator Suite
  // ---------------------------------------------------------
  console.log('\n▶ SUITE 3: Security Header Configuration Generator');

  runTest('Generates Nginx, Apache, Express, and Next.js configurations', () => {
    const gen = generateSecurityHeaderConfigs('app.target.com');
    assert.ok(gen.configs.nginx.includes('add_header Strict-Transport-Security'));
    assert.ok(gen.configs.nginx.includes('add_header Content-Security-Policy'));
    assert.ok(gen.configs.apache.includes('Header always set Strict-Transport-Security'));
    assert.ok(gen.configs.express.includes("require('helmet')"));
    assert.ok(gen.configs.nextjs.includes('nextConfig'));
  });

  // ---------------------------------------------------------
  // SUITE 4: Analysis Engine & Audit Logging Integrity
  // ---------------------------------------------------------
  console.log('\n▶ SUITE 4: Analysis Engine & Report Integrity');

  runTest('Generates Valid Analysis ID Format (XEL-YYYYMMDD-XXXXXXXX)', () => {
    const id = generateAnalysisId();
    assert.match(id, /^XEL-\d{8}-[A-F0-9]{8}$/);
  });

  runTest('Computes Deterministic SHA-256 Report Hash', () => {
    const payload1 = { target: 'example.com', score: 95 };
    const payload2 = { target: 'example.com', score: 95 };
    const hash1 = computeReportHash(payload1);
    const hash2 = computeReportHash(payload2);
    assert.strictEqual(hash1, hash2);
    assert.strictEqual(hash1.length, 64);
  });

  await runAsyncTest('Unified Engine Blocks SSRF Probe and Returns Provenance BLOCKED', async () => {
    const result = await runUnifiedAnalysis('header-inspector', '127.0.0.1');
    assert.strictEqual(result.status, 'BLOCKED');
    assert.strictEqual(result.provenance, 'BLOCKED');
    assert.strictEqual(result.severity, 'CRITICAL');
    assert.ok(result.riskIndicators.some(r => r.indicator.includes('SSRF')));
  });

  await runAsyncTest('Unified Engine Executes Security Header Generator', async () => {
    const result = await runUnifiedAnalysis('security-header-generator', 'example.com');
    assert.strictEqual(result.status, 'COMPLETED');
    assert.ok(result.generatorData.configs.nginx);
    assert.ok(result.evidence.length > 0);
  });

  // ---------------------------------------------------------
  // SUITE 5: Database Persistence, Migrations & Transactional Integrity
  // ---------------------------------------------------------
  console.log('\n▶ SUITE 5: Database Persistence, Migrations & Transactional Integrity');

  runTest('Database Connection Health Check returns HEALTHY status', () => {
    const health = db.checkHealth();
    assert.strictEqual(health.connected, true);
    assert.strictEqual(health.status, 'HEALTHY');
    assert.strictEqual(health.journalMode, 'wal');
    assert.strictEqual(health.foreignKeysEnabled, true);
  });

  runTest('Version-Controlled Migrations are fully applied', () => {
    const migrations = db.prepare('SELECT name FROM _migrations ORDER BY id').all();
    assert.ok(migrations.length >= 3);
    assert.ok(migrations.some(m => m.name.includes('001_initial_schema')));
    assert.ok(migrations.some(m => m.name.includes('002_performance_and_security_indexes')));
  });

  runTest('Performance and security query indexes exist', () => {
    const indexes = db.prepare("SELECT name FROM sqlite_master WHERE type='index'").all().map(i => i.name);
    assert.ok(indexes.includes('idx_scans_user_created'));
    assert.ok(indexes.includes('idx_reports_user'));
    assert.ok(indexes.includes('idx_sessions_token'));
  });

  runTest('Atomic Transaction rolls back changes on exception', () => {
    const testUserId = `test_tx_${Date.now()}`;
    let threw = false;

    try {
      db.runInTransaction(() => {
        db.prepare('INSERT INTO users (id, email, password_hash, full_name) VALUES (?, ?, ?, ?)').run(
          testUserId,
          `${testUserId}@test.local`,
          'hash',
          'Test User'
        );
        throw new Error('Forced transaction failure');
      });
    } catch (e) {
      threw = true;
    }

    assert.strictEqual(threw, true);
    const found = db.prepare('SELECT id FROM users WHERE id = ?').get(testUserId);
    assert.strictEqual(found, undefined, 'Transaction failed to roll back inserted row');
  });

  runTest('Record-level isolation ensures queries respect user_id boundaries', () => {
    const userA = `usr_scope_a_${Date.now()}`;
    const userB = `usr_scope_b_${Date.now()}`;
    const scanId = `scn_scope_${Date.now()}`;

    // Create valid test users satisfying foreign key constraints
    db.prepare('INSERT INTO users (id, email, password_hash, full_name) VALUES (?, ?, ?, ?)').run(
      userA, `${userA}@test.local`, 'hash_a', 'Analyst A'
    );
    db.prepare('INSERT INTO users (id, email, password_hash, full_name) VALUES (?, ?, ?, ?)').run(
      userB, `${userB}@test.local`, 'hash_b', 'Analyst B'
    );

    // Insert scan belonging to userA
    db.prepare(`
      INSERT INTO scans (id, user_id, tool_id, target, status, summary, results_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(scanId, userA, 'header-inspector', 'example.com', 'completed', 'Scope test', '{}');

    // Query scoped to userB must not return userA's scan
    const userBScans = db.prepare('SELECT * FROM scans WHERE id = ? AND user_id = ?').get(scanId, userB);
    assert.strictEqual(userBScans, undefined);

    // Clean up test scan and users
    db.prepare('DELETE FROM scans WHERE id = ?').run(scanId);
    db.prepare('DELETE FROM users WHERE id IN (?, ?)').run(userA, userB);
  });

  runTest('Centralized Audit Service logs security operations without error', () => {
    const initialCount = db.prepare('SELECT count(*) as count FROM audit_logs').get().count;
    logAuditEvent({
      userId: 'usr_audit_test',
      action: 'SECURITY_POSTURE_CHECK',
      target: 'test.local',
      ipAddress: '127.0.0.1'
    });
    const newCount = db.prepare('SELECT count(*) as count FROM audit_logs').get().count;
    assert.strictEqual(newCount, initialCount + 1);
  });

  // ---------------------------------------------------------
  // SUITE 6: Rate Limiter Middleware
  // ---------------------------------------------------------
  console.log('\n▶ SUITE 6: Rate Limiting & DoS Defenses');

  runTest('Sliding Window Rate Limiter throttles requests exceeding limit', () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 3 });
    const req = { headers: {}, socket: { remoteAddress: '198.51.100.5' } };
    let statusSet = null;
    let jsonOutput = null;
    const res = {
      setHeader: () => {},
      status: (code) => { statusSet = code; return res; },
      json: (data) => { jsonOutput = data; }
    };
    const next = () => {};

    // 3 allowed calls
    limiter(req, res, next);
    limiter(req, res, next);
    limiter(req, res, next);
    assert.strictEqual(statusSet, null);

    // 4th call exceeded
    limiter(req, res, next);
    assert.strictEqual(statusSet, 429);
    assert.ok(jsonOutput);
  });

  // ---------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------
  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
