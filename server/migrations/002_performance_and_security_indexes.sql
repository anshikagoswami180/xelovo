-- Migration 002: Performance & Security Query Indexes
-- Optimizes queries by user_id, timestamps, tokens, and target lookups

CREATE INDEX IF NOT EXISTS idx_scans_user_created ON scans(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_tool ON scans(tool_id);
CREATE INDEX IF NOT EXISTS idx_scans_target ON scans(target);
CREATE INDEX IF NOT EXISTS idx_tool_history_user ON tool_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_user ON reports(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investigations_user ON investigations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_time ON audit_logs(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
