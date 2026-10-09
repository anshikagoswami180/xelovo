const net = require('net');
const { URL } = require('url');

/**
 * Validates target domain/IP to prevent Server-Side Request Forgery (SSRF)
 * against internal networks, loopback addresses, and cloud metadata endpoints.
 */
function isPrivateOrLoopbackIp(ip) {
  if (!net.isIP(ip)) return false;

  // IPv4 Checks
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    
    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;
    
    // 10.0.0.0/8 (Private Class A)
    if (parts[0] === 10) return true;

    // 172.16.0.0/12 (Private Class B)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

    // 192.168.0.0/16 (Private Class C)
    if (parts[0] === 192 && parts[1] === 168) return true;

    // 169.254.0.0/16 (Link-Local / Cloud Metadata e.g. 169.254.169.254)
    if (parts[0] === 169 && parts[1] === 254) return true;

    // 0.0.0.0
    if (parts[0] === 0) return true;
  }

  // IPv6 Checks
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === '::1' || lower === '::' || lower.startsWith('fe80:') || lower.startsWith('fc00:') || lower.startsWith('fd00:')) {
      return true;
    }
  }

  return false;
}

function validateTargetInput(inputTarget) {
  if (!inputTarget || typeof inputTarget !== 'string') {
    return { valid: false, reason: 'Empty or invalid target input.' };
  }

  let hostname = inputTarget.trim();

  // If full URL provided, extract hostname
  if (/^https?:\/\//i.test(hostname)) {
    try {
      const parsed = new URL(hostname);
      hostname = parsed.hostname;
    } catch (e) {
      return { valid: false, reason: 'Malformed URL format.' };
    }
  }

  // Remove port if present
  hostname = hostname.split(':')[0].toLowerCase();

  // Check forbidden hostnames
  const forbiddenHostnames = ['localhost', 'loopback', '0.0.0.0', '127.0.0.1', 'metadata.google.internal'];
  if (forbiddenHostnames.includes(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    return { valid: false, reason: `Target '${hostname}' resolves to restricted local/internal infrastructure.` };
  }

  // Check direct IP address
  if (net.isIP(hostname) && isPrivateOrLoopbackIp(hostname)) {
    return { valid: false, reason: `Target IP '${hostname}' is a restricted private/loopback network address.` };
  }

  return { valid: true, hostname };
}

module.exports = {
  isPrivateOrLoopbackIp,
  validateTargetInput
};
