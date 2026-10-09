import React, { useState } from 'react';
import { ShieldAlert, Play, RotateCcw, MessageSquare, AlertCircle, Zap } from 'lucide-react';
import { analyzeScamMessage } from '../utils/scamAnalyzer';
import HonestResponseCard from '../components/HonestResponseCard';

export default function ScamAnalyzerPage() {
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = analyzeScamMessage(messageText);
      setAnalysisResult(res);
      setLoading(false);
    }, 350);
  };

  const handleReset = () => {
    setMessageText('');
    setAnalysisResult(null);
  };

  const loadSyntheticTestMessage = () => {
    const syntheticText = `FINAL WARNING — YOUR ACCOUNT WILL BE SUSPENDED TODAY.

Your account will be permanently suspended within 30 minutes unless you complete urgent security verification.

You MUST provide your account password and 6-digit OTP code.

You must also pay a refundable ₹9,999 security verification fee and send the payment screenshot.

Verification:
http://192.168.1.55/account/verify

Do not contact your bank or official customer support.

This request is confidential. Do not share this message with anyone.`;
    setMessageText(syntheticText);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#19D7E8', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            XELOVO SECURITY TOOLS
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', color: '#F2F5F9', fontFamily: 'var(--font-display)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldAlert color="#19D7E8" size={32} /> Scam Protection Analyzer
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#B5C0D0', marginTop: '0.4rem', maxWidth: '750px' }}>
          Paste WhatsApp messages, SMS alerts, job offers, marketplace chats, or investment proposals to evaluate advance payment demands, fake support claims, and coercion tactics.
        </p>
      </div>

      <div className="xelavo-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#F2F5F9', margin: 0, fontWeight: 700 }}>
            Scam Telemetry Input
          </h3>
          <button onClick={loadSyntheticTestMessage} className="btn-outline-electric" style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Zap size={14} color="#19D7E8" /> Load Synthetic High-Risk Test Suite
          </button>
        </div>

        <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#B5C0D0', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              <MessageSquare size={14} style={{ display: 'inline', marginRight: '0.35rem' }} /> Message or Offer Content
            </label>
            <textarea
              rows={8}
              required
              placeholder="Paste suspicious WhatsApp text, marketplace conversation, job offer details, or crypto investment message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(3, 11, 28, 0.7)',
                border: '1px solid rgba(45, 125, 255, 0.28)',
                borderRadius: '8px',
                color: '#F2F5F9',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn-blue-gradient" disabled={loading} style={{ padding: '0.75rem 1.75rem', fontSize: '0.92rem' }}>
              {loading ? 'Evaluating Scam Indicators...' : 'Run Scam Protection Analysis'} <Play size={16} />
            </button>
            {analysisResult && (
              <button type="button" onClick={handleReset} className="btn-outline-electric" style={{ padding: '0.75rem 1.25rem', fontSize: '0.92rem' }}>
                <RotateCcw size={16} /> Clear Input
              </button>
            )}
          </div>
        </form>
      </div>

      {analysisResult && <HonestResponseCard result={analysisResult} />}
    </div>
  );
}
