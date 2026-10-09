const dns = require('dns').promises;

async function analyzeDomainDNS(domainInput) {
  let domain = domainInput.trim().toLowerCase();
  // Strip protocol/path if user provided full URL
  domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:\d+$/, '');

  const result = {
    domain,
    timestamp: new Date().toISOString(),
    records: {},
    subdomains: [],
    nameservers: [],
    domainAge: null,
    summary: {
      totalRecords: 0,
      hasMx: false,
      hasTxt: false,
      hasSpf: false,
      hasDmarc: false,
      dnssecEnabled: false
    }
  };

  try {
    // 1. A Records
    try {
      const aRecords = await dns.resolve4(domain);
      result.records.A = aRecords;
      result.summary.totalRecords += aRecords.length;
    } catch (e) {
      result.records.A = [];
    }

    // 2. AAAA Records
    try {
      const aaaaRecords = await dns.resolve6(domain);
      result.records.AAAA = aaaaRecords;
      result.summary.totalRecords += aaaaRecords.length;
    } catch (e) {
      result.records.AAAA = [];
    }

    // 3. MX Records
    try {
      const mxRecords = await dns.resolveMx(domain);
      result.records.MX = mxRecords;
      result.summary.hasMx = mxRecords.length > 0;
      result.summary.totalRecords += mxRecords.length;
    } catch (e) {
      result.records.MX = [];
    }

    // 4. TXT Records & SPF / DMARC
    try {
      const txtRecords = await dns.resolveTxt(domain);
      const flattenedTxt = txtRecords.map(r => r.join(''));
      result.records.TXT = flattenedTxt;
      result.summary.totalRecords += flattenedTxt.length;

      result.summary.hasSpf = flattenedTxt.some(t => t.toLowerCase().includes('v=spf1'));
    } catch (e) {
      result.records.TXT = [];
    }

    // Check DMARC explicitly
    try {
      const dmarcTxt = await dns.resolveTxt(`_dmarc.${domain}`);
      const flattenedDmarc = dmarcTxt.map(r => r.join(''));
      result.records.DMARC = flattenedDmarc;
      result.summary.hasDmarc = flattenedDmarc.some(t => t.toLowerCase().includes('v=dmarc1'));
    } catch (e) {
      result.records.DMARC = [];
    }

    // 5. NS Records
    try {
      const nsRecords = await dns.resolveNs(domain);
      result.records.NS = nsRecords;
      result.nameservers = nsRecords;
      result.summary.totalRecords += nsRecords.length;
    } catch (e) {
      result.records.NS = [];
    }

    // 6. CNAME Records
    try {
      const cnameRecords = await dns.resolveCname(domain);
      result.records.CNAME = cnameRecords;
      result.summary.totalRecords += cnameRecords.length;
    } catch (e) {
      result.records.CNAME = [];
    }

    // 7. SOA Record
    try {
      const soaRecord = await dns.resolveSoa(domain);
      result.records.SOA = soaRecord;
      result.summary.totalRecords += 1;
    } catch (e) {
      result.records.SOA = null;
    }

    // 8. Discover legitimate subdomains via common prefixes query
    const commonPrefixes = ['www', 'mail', 'api', 'dev', 'staging', 'blog', 'app', 'vpn', 'remote', 'portal', 'admin', 'cdn', 'shop', 'm'];
    const foundSubdomains = [];

    await Promise.all(
      commonPrefixes.map(async (prefix) => {
        const sub = `${prefix}.${domain}`;
        try {
          const ips = await dns.resolve4(sub);
          if (ips && ips.length > 0) {
            foundSubdomains.push({ subdomain: sub, ips, type: 'A' });
          }
        } catch (e) {
          // Ignore non-existent subdomains
        }
      })
    );

    result.subdomains = foundSubdomains;

  } catch (err) {
    result.error = `DNS resolution failed: ${err.message}`;
  }

  return result;
}

module.exports = { analyzeDomainDNS };
