/**
 * XELOVO In-Memory Sliding Window Rate Limiter
 * Protects platform APIs against brute-force authentication attempts and probe flooding.
 */

function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute
  const max = options.max || 120; // 120 requests per window
  const message = options.message || { error: 'Too many requests. Please retry in a few moments.' };

  const hits = new Map();

  // Periodic cleanup of stale IP records every 2 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of hits.entries()) {
      if (now - record.startTime > windowMs * 2) {
        hits.delete(ip);
      }
    }
  }, 2 * 60 * 1000).unref();

  return function rateLimiter(req, res, next) {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    let record = hits.get(clientIp);
    if (!record || now - record.startTime > windowMs) {
      record = { count: 1, startTime: now };
      hits.set(clientIp, record);
      return next();
    }

    record.count++;
    if (record.count > max) {
      const retryAfterSeconds = Math.ceil((windowMs - (now - record.startTime)) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json(message);
    }

    next();
  };
}

const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 150,
  message: { error: 'XELOVO API Rate Limit exceeded. Please throttle requests.' }
});

const scanLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 40,
  message: { error: 'Security probe limit reached for this IP. Please wait 60 seconds before initiating further scans.' }
});

module.exports = {
  createRateLimiter,
  apiLimiter,
  scanLimiter
};
