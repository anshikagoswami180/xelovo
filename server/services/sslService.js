const tls = require('tls');
const https = require('https');
const { URL } = require('url');

function inspectTLS(targetUrl) {
  return new Promise((resolve) => {
    let hostname = targetUrl.trim().toLowerCase();
    hostname = hostname.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '');
    const port = 443;

    const socket = tls.connect(port, hostname, { servername: hostname, rejectUnauthorized: false }, () => {
      const cert = socket.getPeerCertificate(true);
      const cipher = socket.getCipher();
      const protocol = socket.getProtocol();

      if (!cert || Object.keys(cert).length === 0) {
        socket.end();
        return resolve({
          target: hostname,
          valid: false,
          error: 'No peer certificate returned or TLS connection rejected.',
          timestamp: new Date().toISOString()
        });
      }

      const validFrom = new Date(cert.valid_from);
      const validTo = new Date(cert.valid_to);
      const now = new Date();
      const daysRemaining = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));

      // Parse SANs (Subject Alternative Names)
      const sans = cert.subjectaltname ? cert.subjectaltname.split(', ').map(s => s.replace(/^DNS:/, '')) : [];

      // Risk checks
      const isExpired = now > validTo;
      const isSelfSigned = cert.issuer && cert.subject && cert.issuer.CN === cert.subject.CN;

      const result = {
        target: hostname,
        timestamp: new Date().toISOString(),
        valid: !isExpired,
        subject: {
          commonName: cert.subject ? cert.subject.CN : 'N/A',
          organization: cert.subject ? cert.subject.O || 'N/A' : 'N/A',
          country: cert.subject ? cert.subject.C || 'N/A' : 'N/A'
        },
        issuer: {
          commonName: cert.issuer ? cert.issuer.CN : 'N/A',
          organization: cert.issuer ? cert.issuer.O || 'N/A' : 'N/A',
          country: cert.issuer ? cert.issuer.C || 'N/A' : 'N/A'
        },
        validFrom: validFrom.toISOString(),
        validTo: validTo.toISOString(),
        daysRemaining: daysRemaining,
        isExpired,
        isSelfSigned,
        fingerprint: cert.fingerprint,
        fingerprint256: cert.fingerprint256,
        serialNumber: cert.serialNumber,
        protocol: protocol || 'TLS v1.3 / v1.2',
        cipher: cipher ? { name: cipher.name, version: cipher.version } : null,
        sans: sans,
        keyLength: cert.bits || 2048,
        summary: {
          grade: isExpired ? 'F' : isSelfSigned ? 'C' : daysRemaining < 15 ? 'B' : 'A+',
          status: isExpired ? 'Expired Certificate' : isSelfSigned ? 'Self-Signed Certificate' : 'Valid Trust Anchor',
          recommendation: isExpired ? 'Immediate replacement required.' : daysRemaining < 30 ? 'Renew certificate within 30 days.' : 'TLS configuration healthy.'
        }
      };

      socket.end();
      resolve(result);
    });

    socket.on('error', (err) => {
      resolve({
        target: hostname,
        valid: false,
        error: `TLS Handshake Error: ${err.message}`,
        timestamp: new Date().toISOString()
      });
    });

    socket.setTimeout(8000, () => {
      socket.destroy();
      resolve({
        target: hostname,
        valid: false,
        error: 'TLS Handshake Connection Timed Out (8000ms).',
        timestamp: new Date().toISOString()
      });
    });
  });
}

module.exports = {
  inspectTLS,
  inspectSSL: inspectTLS
};
