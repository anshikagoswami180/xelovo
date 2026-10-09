import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, ShieldAlert, FileText, Info, Wrench, CheckCircle2 } from 'lucide-react';
import { apiAskAi } from '../utils/api';

export default function XelavoAiPage() {
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: "### XELA — Conversational AI & Security Intelligence\n\nHello! I am XELA, your conversational AI assistant. Ask me anything about cybersecurity, networking, programming, technical troubleshooting, study plans, or active XELOVO security telemetry."
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'thinking' | 'calling_tool' | 'analyzing' | 'complete' | 'error'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || status === 'thinking' || status === 'calling_tool') return;

    const userText = inputQuery.trim();
    const currentHistory = [...messages];

    const newUserMsg = { id: `user-${Date.now()}`, sender: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputQuery('');
    setStatus('thinking');

    try {
      // If query looks like a domain check, set status badge to calling_tool
      if (/check|scan|inspect/i.test(userText) && /([a-z0-9-]+\.)+[a-z]{2,}/i.test(userText)) {
        setStatus('calling_tool');
      }

      const res = await apiAskAi(userText, null, currentHistory);

      const newAiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.answer,
        toolsUsed: res.toolsUsed || [],
        confidence: res.confidence || null
      };

      setMessages(prev => [...prev, newAiMsg]);
      setStatus('complete');
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: "XELA couldn't complete that request because the analysis service is currently unavailable. Please try again."
      }]);
      setStatus('error');
    } finally {
      setTimeout(() => setStatus('idle'), 1000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const samplePrompts = [
    "What is phishing?",
    "Explain TCP vs UDP",
    "How do I become a cybersecurity professional?",
    "Check security headers for example.com",
    "Explain this like I'm 10"
  ];

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: 'calc(100vh - 120px)' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.65rem', backgroundColor: 'rgba(25, 215, 232, 0.15)', borderRadius: '10px', color: '#19D7E8', border: '1px solid rgba(25, 215, 232, 0.3)' }}>
            <Bot size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#F2F5F9', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
              XELA — Conversational AI Assistant
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#B5C0D0', margin: 0 }}>
              Universal Technical AI & Evidence-Grounded Security Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* SAMPLE QUICK PROMPTS */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => setInputQuery(prompt)}
            style={{
              backgroundColor: 'rgba(9, 27, 54, 0.7)',
              border: '1px solid rgba(45, 125, 255, 0.25)',
              color: '#B5C0D0',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* CHAT CONTAINER */}
      <div className="xelavo-card" style={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '480px' }}>
        
        {/* MESSAGES FEED */}
        <div 
          role="log"
          aria-live="polite"
          style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: '#030B1C' }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                backgroundColor: m.sender === 'user' ? 'rgba(22, 136, 255, 0.18)' : 'rgba(9, 27, 54, 0.85)',
                border: m.sender === 'user' ? '1px solid rgba(22, 136, 255, 0.4)' : '1px solid rgba(45, 125, 255, 0.25)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                fontSize: '0.9rem',
                color: '#F2F5F9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: m.sender === 'user' ? '#1688FF' : '#19D7E8' }}>
                  {m.sender === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                  <strong>{m.sender === 'user' ? 'Analyst' : 'XELA'}</strong>
                </div>

                {/* Tool Badges */}
                {m.toolsUsed && m.toolsUsed.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.7rem', fontWeight: 700 }}>
                    <Wrench size={11} /> Tool Executed: {m.toolsUsed.join(', ')}
                  </div>
                )}
              </div>

              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{m.text}</div>
            </div>
          ))}

          {/* STATUS PIPELINE INDICATORS */}
          {status === 'thinking' && (
            <div style={{ fontSize: '0.85rem', color: '#19D7E8', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
              <Sparkles size={16} className="animate-pulse" /> XELA is reasoning and analyzing intent...
            </div>
          )}

          {status === 'calling_tool' && (
            <div style={{ fontSize: '0.85rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
              <Wrench size={16} className="animate-spin" /> Executing live XELOVO tool probe...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BOX */}
        <form onSubmit={handleSend} style={{ padding: '1rem', backgroundColor: '#06142B', borderTop: '1px solid rgba(45, 125, 255, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(3, 11, 28, 0.7)', border: '1px solid rgba(45, 125, 255, 0.3)', borderRadius: '8px', padding: '0.65rem 1rem', gap: '0.75rem' }}>
            <textarea
              rows={1}
              placeholder="Ask XELA anything..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Ask XELA input"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#F2F5F9',
                fontSize: '0.9rem',
                width: '100%',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.4
              }}
            />
            <button 
              type="submit" 
              className="btn-blue-gradient" 
              disabled={status === 'thinking' || status === 'calling_tool'}
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              Ask XELA <Send size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
