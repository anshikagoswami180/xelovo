import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info, HelpCircle, CheckCircle2, FileText, Download, Code, Eye, Lock } from 'lucide-react';
import AnalysisTimeline from './AnalysisTimeline';
import ReportPreviewModal from './ReportPreviewModal';

export default function HonestResponseCard({ result }) {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  if (!result) return null;

  const {
    analysisId = 'XEL-20260920-LIVE',
    riskScore = 0,
    assessment = 'Low detected risk',
    riskLevel = 'Low Risk',
    confidence = 'HIGH',
    classifiedObservations = [],
    verifiedFacts = [],
    riskIndicators = [],
    scoreBreakdown = [],
    recommendedActions = [],
    limitations = [],
    unverifiedAspects = [],
    networkOperations = [],
    honestDisclaimer = '',
    evidence = [],
    severity = 'LOW'
  } = result;

  const getScoreColor = (score, sev) => {
    if (sev === 'CRITICAL' || score >= 80) return '#EF4444';
    if (sev === 'HIGH' || score >= 60) return '#F97316';
    if (sev === 'ELEVATED' || score >= 40) return '#F59E0B';
    if (sev === 'MODERATE' || score >= 20) return '#EAB308';
    return '#10B981';
  };

  const scoreColor = getScoreColor(riskScore, severity);

  const downloadJsonReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${analysisId}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadMarkdownReport = () => {
    let md = `# XELOVO Security Analysis Report\n\n`;
    md += `**Analysis ID:** \`${analysisId}\`  \n`;
    md += `**Generated Timestamp:** \`${new Date().toISOString()}\`  \n`;
    md += `**Severity:** \`${severity}\` (Score: ${riskScore}/100) | **Confidence:** \`${confidence}\`  \n\n`;
    md += `## Executive Summary\n> ${assessment}\n\n`;
    md += `## Classified Observations\n`;
    classifiedObservations.forEach(obs => {
      md += `- **[${obs.type || 'OBSERVED'}]**: ${obs.text || obs}\n`;
    });
    md += `\n## Verified Evidence\n`;
    evidence.forEach(ev => {
      md += `- **${ev.category || 'General'}** (${ev.status || 'VERIFIED'}): ${ev.value} (Source: ${ev.source})\n`;
    });
    md += `\n## Risk Indicators & Score Breakdown\n`;
    scoreBreakdown.forEach(sb => {
      md += `- ⚠️ **${sb.indicator}**: +${sb.points} pts (Quote: "${sb.quote}")\n`;
    });
    md += `\n## WHAT WAS NOT VERIFIED\n`;
    (unverifiedAspects.length > 0 ? unverifiedAspects : limitations).forEach(u => {
      md += `- ⚠️ ${u}\n`;
    });
    md += `\n## Recommended Actions\n`;
    recommendedActions.forEach(act => {
      md += `- ✅ ${act}\n`;
    });

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${analysisId}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
      {/* VERDICT & ANALYSIS ID HEADER CARD */}
      <div className="xelavo-card" style={{
        padding: '1.75rem',
        backgroundColor: '#091B36',
        borderLeft: `5px solid ${scoreColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: 'rgba(3, 11, 28, 0.8)',
            border: `3px solid ${scoreColor}`,
            boxShadow: `0 0 20px ${scoreColor}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <span style={{ fontSize: '1.55rem', fontWeight: 800, color: scoreColor, fontFamily: 'var(--font-mono)' }}>
              {riskScore}
            </span>
            <span style={{ fontSize: '0.6rem', color: '#B5C0D0', textTransform: 'uppercase' }}>Score</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: scoreColor,
                backgroundColor: `${scoreColor}1F`,
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                border: `1px solid ${scoreColor}40`
              }}>
                SEVERITY: {severity}
              </span>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#19D7E8',
                backgroundColor: 'rgba(25, 215, 232, 0.15)',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid rgba(25, 215, 232, 0.3)'
              }}>
                Confidence: {confidence}
              </span>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#1688FF',
                fontFamily: 'var(--font-mono)',
                backgroundColor: 'rgba(22, 136, 255, 0.15)',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid rgba(22, 136, 255, 0.3)'
              }}>
                {analysisId}
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: '#F2F5F9', marginTop: '0.4rem', fontWeight: 800 }}>
              {assessment}
            </h2>
          </div>
        </div>

        {/* Multi-Format Export & Preview Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowPreviewModal(true)} className="btn-blue-gradient" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Eye size={15} /> Preview Report
          </button>
          <button onClick={() => setShowPreviewModal(true)} className="btn-outline-electric" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Download size={14} /> PDF
          </button>
          <button onClick={downloadJsonReport} className="btn-outline-electric" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Code size={14} /> JSON
          </button>
          <button onClick={downloadMarkdownReport} className="btn-outline-electric" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FileText size={14} /> MD
          </button>
        </div>
      </div>

      {/* ANALYSIS TIMELINE */}
      <AnalysisTimeline analysis={result} />

      {/* SCORE BREAKDOWN TABLE (If Dynamic Risk Calculation Present) */}
      {scoreBreakdown.length > 0 && (
        <div className="xelavo-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', color: '#F2F5F9', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} color={scoreColor} /> Risk Score Contribution Breakdown (+{riskScore} Total Pts)
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: '#F2F5F9' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(6, 20, 43, 0.8)', textAlign: 'left' }}>
                  <th style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid rgba(45, 125, 255, 0.25)' }}>Indicator Name</th>
                  <th style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid rgba(45, 125, 255, 0.25)' }}>Trigger Evidence Quote</th>
                  <th style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid rgba(45, 125, 255, 0.25)', width: '90px' }}>Points</th>
                </tr>
              </thead>
              <tbody>
                {scoreBreakdown.map((sb, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(45, 125, 255, 0.12)' }}>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: '#F2F5F9' }}>{sb.indicator}</td>
                    <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#19D7E8' }}>"{sb.quote}"</td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: '#EF4444' }}>+{sb.points} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CLASSIFIED OBSERVATIONS & RISK INDICATORS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Classified Observations A-H */}
        <div className="xelavo-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', color: '#19D7E8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="#19D7E8" /> Classified Empirical Observations ({classifiedObservations.length || verifiedFacts.length})
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(classifiedObservations.length > 0 ? classifiedObservations : verifiedFacts.map(f => ({ type: 'USER_PROVIDED', text: f }))).map((obs, idx) => (
              <li key={idx} style={{ fontSize: '0.85rem', color: '#F2F5F9', backgroundColor: 'rgba(25, 215, 232, 0.06)', padding: '0.65rem 0.85rem', borderRadius: '6px', borderLeft: '3px solid #19D7E8' }}>
                <span style={{ fontSize: '0.72rem', color: '#19D7E8', fontWeight: 700, display: 'block', marginBottom: '0.15rem' }}>{obs.type || 'OBSERVED'}</span>
                {obs.text || obs}
              </li>
            ))}
          </ul>
        </div>

        {/* Risk Indicators */}
        <div className="xelavo-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', color: scoreColor, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} color={scoreColor} /> Concrete Risk Indicators ({riskIndicators.length})
          </h3>
          {riskIndicators.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {riskIndicators.map((ind, idx) => (
                <li key={idx} style={{ fontSize: '0.85rem', color: '#F2F5F9', backgroundColor: `${scoreColor}14`, padding: '0.65rem 0.85rem', borderRadius: '6px', borderLeft: `3px solid ${scoreColor}` }}>
                  <strong style={{ color: scoreColor, display: 'block' }}>{ind.indicator || ind}</strong>
                  {ind.impact && <span style={{ fontSize: '0.78rem', color: '#B5C0D0' }}>{ind.impact}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', color: '#10B981', fontSize: '0.86rem' }}>
              No matching suspicious indicator was observed in the available checks.
            </div>
          )}
        </div>
      </div>

      {/* MANDATORY SECTION: WHAT WAS NOT VERIFIED */}
      <div className="xelavo-card" style={{ padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <h3 style={{ fontSize: '1rem', color: '#EF4444', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <HelpCircle size={18} color="#EF4444" /> Mandatory Disclosure: WHAT WAS NOT VERIFIED
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#B5C0D0' }}>
          {(unverifiedAspects.length > 0 ? unverifiedAspects : limitations).map((u, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#EF4444', fontWeight: 800 }}>•</span> {u}
            </li>
          ))}
          {unverifiedAspects.length === 0 && (
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#EF4444', fontWeight: 800 }}>•</span> Third-party malware reputation databases were not queried (API Key unconfigured).
            </li>
          )}
        </ul>
      </div>

      {/* RECOMMENDATIONS & LIMITATIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {recommendedActions.length > 0 && (
          <div className="xelavo-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#F2F5F9', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="#1688FF" /> Actionable Defensive Guidance
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {recommendedActions.map((act, idx) => (
                <li key={idx} style={{ fontSize: '0.86rem', color: '#B5C0D0', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#1688FF', fontWeight: 800 }}>•</span> {act}
                </li>
              ))}
            </ul>
          </div>
        )}

        {limitations.length > 0 && (
          <div className="xelavo-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#8494AB', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={18} color="#8494AB" /> Technical Limitations
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {limitations.map((lim, idx) => (
                <li key={idx} style={{ fontSize: '0.82rem', color: '#8494AB' }}>
                  • {lim}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* REPORT PREVIEW MODAL COMPONENT */}
      <ReportPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        analysis={result}
      />
    </div>
  );
}
