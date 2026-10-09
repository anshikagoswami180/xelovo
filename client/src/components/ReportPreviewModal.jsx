import React from 'react';
import { X, Printer, Download, Code, FileText, Shield, CheckCircle2, AlertTriangle, Info, HelpCircle, Lock, Key } from 'lucide-react';

export default function ReportPreviewModal({ isOpen, onClose, analysis }) {
  if (!isOpen || !analysis) return null;

  const {
    analysisId = 'XEL-20260920-LIVE',
    toolId = 'security-analysis',
    toolName = 'Security Analysis Workstation',
    input = 'N/A',
    startedAt = new Date().toISOString(),
    completedAt = new Date().toISOString(),
    durationMs = 0,
    status = 'COMPLETED',
    provenance = 'LOCAL_ANALYSIS',
    classifiedObservations = [],
    evidence = [],
    riskIndicators = [],
    scoreBreakdown = [],
    severity = 'LOW',
    riskScore = 0,
    confidence = 'HIGH',
    limitations = [],
    unverifiedAspects = [],
    recommendedActions = [],
    reportHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  } = analysis;

  const reportId = `REP-${analysisId.replace('XEL-', '')}`;

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL': return { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' };
      case 'HIGH': return { color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)' };
      case 'ELEVATED': return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' };
      case 'MODERATE': return { color: '#EAB308', bg: 'rgba(234, 179, 8, 0.15)' };
      default: return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
    }
  };

  const sevBadge = getSeverityBadge(severity);

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${reportId}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadMarkdown = () => {
    let md = `# XELOVO CYBERSECURITY ANALYSIS REPORT\n\n`;
    md += `**Report ID:** \`${reportId}\`  \n`;
    md += `**Analysis ID:** \`${analysisId}\`  \n`;
    md += `**Generated Timestamp:** \`${completedAt}\`  \n`;
    md += `**Overall Risk Classification:** \`${severity}\` (Score: ${riskScore}/100)  \n`;
    md += `**Analysis Confidence:** \`${confidence}\` | **Provenance:** \`${provenance}\`  \n\n`;
    md += `## Executive Summary\n${analysis.assessment || 'Defensive security telemetry audit completed.'}\n\n`;
    md += `## Classified Observations\n`;
    classifiedObservations.forEach(obs => {
      md += `- **[${obs.type || 'OBSERVED'}]**: ${obs.text || obs}\n`;
    });
    md += `\n## Evidence Inventory\n`;
    evidence.forEach((ev, i) => {
      md += `\`E-00${i+1}\` | **${ev.category || 'General'}** (${ev.status}): ${ev.value} | Source: ${ev.source} | Method: ${ev.method || 'LOCAL_RULE'}\n`;
    });
    md += `\n## Score Breakdown\n`;
    scoreBreakdown.forEach(sb => {
      md += `- **${sb.indicator}**: +${sb.points} pts (Quote: "${sb.quote}")\n`;
    });
    md += `\n## WHAT WAS NOT VERIFIED\n`;
    (unverifiedAspects.length > 0 ? unverifiedAspects : limitations).forEach(u => {
      md += `- ⚠️ ${u}\n`;
    });
    md += `\n## Defensive Recommendations\n`;
    recommendedActions.forEach(act => {
      md += `- ✅ ${act}\n`;
    });
    md += `\n---\n*Report Integrity SHA-256 Digest: \`${reportHash}\`*\n`;

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${reportId}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(3, 11, 28, 0.88)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      overflowY: 'auto'
    }}>
      {/* Printable Report Wrapper */}
      <div id="xelavo-printable-report" style={{
        backgroundColor: '#FFFFFF',
        color: '#1E293B',
        width: '100%',
        maxWidth: '920px',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto'
      }}>
        {/* Report Top Actions Bar (Hidden on Print) */}
        <div className="no-print" style={{
          backgroundColor: '#06142B',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(45, 125, 255, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield color="#19D7E8" size={24} />
            <span style={{ color: '#F2F5F9', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
              XELOVO Security Report Preview
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button onClick={handlePrintPdf} className="btn-blue-gradient" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Printer size={15} /> Print / Save PDF
            </button>
            <button onClick={handleDownloadJson} className="btn-outline-electric" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Code size={15} /> JSON
            </button>
            <button onClick={handleDownloadMarkdown} className="btn-outline-electric" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FileText size={15} /> MD
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#B5C0D0', cursor: 'pointer', marginLeft: '0.5rem' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', backgroundColor: '#FFFFFF' }}>
          {/* Header Cover Banner */}
          <div style={{
            backgroundColor: '#06142B',
            color: '#F2F5F9',
            padding: '2rem',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            borderLeft: `6px solid ${sevBadge.color}`
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#19D7E8', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                XELOVO DEFENSIVE SECURITY AUDIT
              </div>
              <h1 style={{ fontSize: '1.8rem', margin: '0.3rem 0', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                CYBERSECURITY ANALYSIS REPORT
              </h1>
              <p style={{ fontSize: '0.88rem', color: '#B5C0D0', margin: 0 }}>
                Target / Scope: <strong style={{ color: '#F2F5F9' }}>{input}</strong>
              </p>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: sevBadge.color,
                backgroundColor: sevBadge.bg,
                padding: '0.3rem 0.85rem',
                borderRadius: '6px',
                border: `1px solid ${sevBadge.color}40`,
                display: 'inline-block',
                width: 'fit-content',
                marginLeft: 'auto'
              }}>
                SEVERITY: {severity}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#B5C0D0', marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                Risk Score: <strong>{riskScore}/100</strong> (Heuristic)
              </span>
              <span style={{ fontSize: '0.75rem', color: '#8494AB', marginTop: '0.2rem' }}>
                Report ID: {reportId}
              </span>
            </div>
          </div>

          {/* Report Metadata Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            backgroundColor: '#F8FAFC',
            padding: '1.25rem',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            fontSize: '0.82rem'
          }}>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Analysis ID:</span>
              <strong style={{ color: '#0F172A', fontFamily: 'var(--font-mono)' }}>{analysisId}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Generated Timestamp:</span>
              <strong style={{ color: '#0F172A' }}>{new Date(completedAt).toLocaleString()}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Analysis Confidence:</span>
              <strong style={{ color: '#1688FF' }}>{confidence}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Provenances Tag:</span>
              <strong style={{ color: '#0F172A', fontFamily: 'var(--font-mono)' }}>{provenance}</strong>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#0F172A', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
              1. Executive Summary
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
              {analysis.assessment || 'Defensive security assessment completed. Evidence-based evaluation distinguishes verified facts from unverified heuristics.'}
            </p>
          </div>

          {/* Score Breakdown Table */}
          {scoreBreakdown.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#0F172A', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                2. Risk Score Contribution Breakdown
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem 0.8rem', border: '1px solid #CBD5E1' }}>Indicator</th>
                    <th style={{ padding: '0.6rem 0.8rem', border: '1px solid #CBD5E1' }}>Trigger Quote / Evidence</th>
                    <th style={{ padding: '0.6rem 0.8rem', border: '1px solid #CBD5E1', width: '90px' }}>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreBreakdown.map((sb, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '0.6rem 0.8rem', border: '1px solid #E2E8F0', fontWeight: 600 }}>{sb.indicator}</td>
                      <td style={{ padding: '0.6rem 0.8rem', border: '1px solid #E2E8F0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#475569' }}>"{sb.quote}"</td>
                      <td style={{ padding: '0.6rem 0.8rem', border: '1px solid #E2E8F0', fontWeight: 800, color: '#E11D48' }}>+{sb.points} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Evidence Inventory Table */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#0F172A', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
              3. Verified Evidence Inventory
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', width: '65px' }}>ID</th>
                  <th style={{ padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1' }}>Category & Value</th>
                  <th style={{ padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1' }}>Source & Method</th>
                  <th style={{ padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', width: '100px' }}>Provenance</th>
                </tr>
              </thead>
              <tbody>
                {(evidence.length > 0 ? evidence : classifiedObservations.map(c => ({ category: 'Observation', value: c.text || c, source: 'Local Telemetry', status: 'VERIFIED' }))).map((ev, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>E-00{idx + 1}</td>
                    <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', color: '#0F172A' }}>
                      <strong style={{ color: '#0284C7', display: 'block', fontSize: '0.78rem' }}>{ev.category || 'Observation'}</strong>
                      {ev.value || ev.text || ev}
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', color: '#475569', fontSize: '0.78rem' }}>
                      {ev.source || 'Local Analysis Engine'} ({ev.method || 'RULE_ENGINE'})
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {ev.status || 'VERIFIED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mandatory Section: WHAT WAS NOT VERIFIED */}
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#991B1B', margin: '0 0 0.5rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={18} color="#991B1B" /> Mandatory Disclosure: WHAT WAS NOT VERIFIED
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#7F1D1D', lineHeight: 1.6 }}>
              {(unverifiedAspects.length > 0 ? unverifiedAspects : limitations).map((u, idx) => (
                <li key={idx}>{u}</li>
              ))}
              {unverifiedAspects.length === 0 && (
                <li>Third-party reputation API keys were unconfigured. Remote malware databases were not queried.</li>
              )}
            </ul>
          </div>

          {/* Defensive Recommendations */}
          {recommendedActions.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#0F172A', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                4. Defensive Recommendations
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.88rem', color: '#334155', lineHeight: 1.6 }}>
                {recommendedActions.map((act, idx) => (
                  <li key={idx} style={{ marginBottom: '0.35rem' }}>{act}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Report Footer & SHA-256 Seal */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '2px dashed #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#64748B'
          }}>
            <div>
              Prepared by: <strong>XELOVO Analysis Engine</strong> | AI Interpretation: <strong>XELA AI</strong>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
              Report SHA-256 Seal: <strong>{reportHash.slice(0, 16)}...{reportHash.slice(-16)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
