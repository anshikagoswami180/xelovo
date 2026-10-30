import React, { useState } from 'react';
import { Eye, Shield, Play, RotateCcw, Lock, MessageSquare, Mail, Link as LinkIcon, Info } from 'lucide-react';
import { analyzePhishingInput } from '../utils/phishingAnalyzer';
import HonestResponseCard from '../components/HonestResponseCard';

export default function PhishingAnalyzerPage() {
  const [url, setUrl] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailSender, setEmailSender] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = analyzePhishingInput({ url, emailSubject, emailSender, messageContent });
      setAnalysisResult(res);
      setLoading(false);
    }, 400);
  };

  const handleReset = () => {
    setUrl('');
    setEmailSubject('');
    setEmailSender('');
    setMessageContent('');
    setAnalysisResult(null);
  };

  const loadSampleSuspicious = () => {
    setUrl('https://example-phishing-test.com/login-verify-bank/auth');
    setEmailSubject('[DEMONSTRATION DATA] URGENT: Your Account Has Been Suspended');
    setEmailSender('security-update@free-mail-provider.com');
    setMessageContent('[DEMONSTRATION DATA] Dear Customer, your bank account is temporarily blocked due to unauthorized attempts. Please click the link immediately and enter your OTP verification code to restore access within 24 hours.');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#1688FF', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            XELOVO SECURITY TOOLS
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', color: '#F2F5F9', fontFamily: 'var(--font-display)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Eye color="#1688FF" size={32} /> Phishing Analyzer Workstation
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#B5C0D0', marginTop: '0.4rem', maxWidth: '750px' }}>
          Submit suspicious links, email headers, or text message content to detect lookalike domain patterns, credential harvesting triggers, and phishing indicators.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="xelavo-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#F2F5F9', margin: 0, fontWeight: 700 }}>
            Input Telemetry Data
          </h3>
          <button onClick={loadSampleSuspicious} className="btn-outline-electric" style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}>
            Load Sample Phishing Telemetry
          </button>
        </div>

        <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Suspicious URL */}
          <div>
            <label style={{ fontSize: '0.82rem', color: '#B5C0D0', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              <LinkIcon size={14} style={{ display: 'inline', marginRight: '0.35rem' }} /> Suspicious URL (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. http://192.168.1.1/login-verify-account or suspicious link..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(3, 11, 28, 0.7)',
                border: '1px solid rgba(45, 125, 255, 0.28)',
                borderRadius: '8px',
                color: '#F2F5F9',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Email Sender */}
            <div>
              <label style={{ fontSize: '0.82rem', color: '#B5C0D0', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                <Mail size={14} style={{ display: 'inline', marginRight: '0.35rem' }} /> Email Sender Address (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. support@verify-bank.com"
                value={emailSender}
                onChange={(e) => setEmailSender(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(3, 11, 28, 0.7)',
                  border: '1px solid rgba(45, 125, 255, 0.28)',
                  borderRadius: '8px',
                  color: '#F2F5F9',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Email Subject */}
            <div>
              <label style={{ fontSize: '0.82rem', color: '#B5C0D0', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                Email Subject Line (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. URGENT: Action Required on Your Account"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(3, 11, 28, 0.7)',
                  border: '1px solid rgba(45, 125, 255, 0.28)',
                  borderRadius: '8px',
                  color: '#F2F5F9',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Message Content */}
          <div>
            <label style={{ fontSize: '0.82rem', color: '#B5C0D0', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              <MessageSquare size={14} style={{ display: 'inline', marginRight: '0.35rem' }} /> Message or Email Body Content (Optional)
            </label>
            <textarea
              rows={4}
              placeholder="Paste email text, SMS message, or chat content to evaluate for phishing patterns..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(3, 11, 28, 0.7)',
                border: '1px solid rgba(45, 125, 255, 0.28)',
                borderRadius: '8px',
                color: '#F2F5F9',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn-blue-gradient" disabled={loading} style={{ padding: '0.75rem 1.75rem', fontSize: '0.92rem' }}>
              {loading ? 'Analyzing Indicators...' : 'Run Phishing Analysis'} <Play size={16} />
            </button>
            {analysisResult && (
              <button type="button" onClick={handleReset} className="btn-outline-electric" style={{ padding: '0.75rem 1.25rem', fontSize: '0.92rem' }}>
                <RotateCcw size={16} /> Clear Inputs
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Analysis Output */}
      {analysisResult && <HonestResponseCard result={analysisResult} />}
    </div>
  );
}
