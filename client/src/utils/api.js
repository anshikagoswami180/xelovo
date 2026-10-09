const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('xelovo_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRegister(email, password, fullName) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  if (data.token) localStorage.setItem('xelovo_token', data.token);
  return data;
}

export async function apiLogin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  if (data.token) localStorage.setItem('xelovo_token', data.token);
  return data;
}

export async function apiExecuteScan(toolId, target, authorizationConfirmed = false, options = {}, file = null) {
  const headers = { ...getAuthHeader() };
  let body;

  if (file) {
    body = new FormData();
    body.append('toolId', toolId);
    body.append('target', target || '');
    body.append('authorizationConfirmed', authorizationConfirmed);
    body.append('options', JSON.stringify(options));
    body.append('file', file);
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify({ toolId, target, authorizationConfirmed, options });
  }

  const res = await fetch(`${API_BASE}/scans/execute`, {
    method: 'POST',
    headers,
    body
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Scan execution failed');
  return data;
}

export async function apiFetchScanHistory() {
  const res = await fetch(`${API_BASE}/scans/history`, {
    headers: getAuthHeader()
  });
  return res.json();
}

export async function apiFetchIntelligenceOverview() {
  const res = await fetch(`${API_BASE}/intelligence/overview`, {
    headers: getAuthHeader()
  });
  return res.json();
}

export async function apiAskAi(message, scanContext = null, history = []) {
  const res = await fetch(`${API_BASE}/scans/ai/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ message, scanContext, history })
  });
  return res.json();
}

export async function apiSaveReport(title, scope, findings) {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ title, scope, findings })
  });
  return res.json();
}

export async function apiFetchReports() {
  const res = await fetch(`${API_BASE}/reports`, {
    headers: getAuthHeader()
  });
  return res.json();
}
