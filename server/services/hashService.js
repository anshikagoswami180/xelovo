const crypto = require('crypto');

function computeHashes(bufferOrText) {
  const isBuffer = Buffer.isBuffer(bufferOrText);
  const data = isBuffer ? bufferOrText : String(bufferOrText);

  const sha256 = crypto.createHash('sha256').update(data).digest('hex');
  const sha1 = crypto.createHash('sha1').update(data).digest('hex');
  const md5 = crypto.createHash('md5').update(data).digest('hex');
  const sha512 = crypto.createHash('sha512').update(data).digest('hex');

  return {
    sha256,
    sha1,
    md5,
    sha512,
    sizeBytes: isBuffer ? bufferOrText.length : Buffer.byteLength(data, 'utf8')
  };
}

function processEncoding(text, mode) {
  if (!text) return { result: '', mode };

  switch (mode) {
    case 'base64_encode':
      return { result: Buffer.from(text).toString('base64'), mode };
    case 'base64_decode':
      try {
        return { result: Buffer.from(text, 'base64').toString('utf8'), mode };
      } catch (e) {
        return { result: 'Error: Invalid Base64 String', mode };
      }
    case 'url_encode':
      return { result: encodeURIComponent(text), mode };
    case 'url_decode':
      try {
        return { result: decodeURIComponent(text), mode };
      } catch (e) {
        return { result: 'Error: Invalid URL Encoded String', mode };
      }
    case 'sha256':
      return { result: crypto.createHash('sha256').update(text).digest('hex'), mode };
    case 'sha512':
      return { result: crypto.createHash('sha512').update(text).digest('hex'), mode };
    default:
      return { result: text, mode };
  }
}

function checkHashReputation(hash) {
  const cleanHash = hash.trim().toLowerCase();
  // Standard VirusTotal / Threat Intelligence API hook disclosure
  const hasVtApiKey = !!process.env.VIRUSTOTAL_API_KEY;

  if (!hasVtApiKey) {
    return {
      hash: cleanHash,
      status: 'API Unconfigured',
      verdict: 'No verified result is currently available.',
      reason: 'VIRUSTOTAL_API_KEY environment variable is not configured on the XELOVO server. Configure an API key to enable live malware reputation lookups.',
      hashes: {
        hashType: cleanHash.length === 64 ? 'SHA-256' : cleanHash.length === 40 ? 'SHA-1' : cleanHash.length === 32 ? 'MD5' : 'Unknown Hash Format'
      }
    };
  }

  // If VT API key configured, caller can query live VT API
  return {
    hash: cleanHash,
    status: 'Ready for live VT lookup',
    hasApiKey: true
  };
}

module.exports = { computeHashes, processEncoding, checkHashReputation };
