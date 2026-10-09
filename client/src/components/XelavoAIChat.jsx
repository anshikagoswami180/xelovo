import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, Wrench } from 'lucide-react';
import { apiAskAi } from '../utils/api';

export default function XelavoAIChat({ isOpen, onClose, activeScanContext }) {
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: "### XELA — Conversational AI Assistant\n\nHello! I am XELA. Ask me anything about cybersecurity, networking, programming, technical troubleshooting, or active XELOVO security telemetry."
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'thinking' | 'calling_tool' | 'analyzing' | 'complete' | 'error'
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, status]);

  if (!isOpen) return null;

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
      if (/check|scan|inspect/i.test(userText) && /([a-z0-9-]+\.)+[a-z]{2,}/i.test(userText)) {
        setStatus('calling_tool');
      }

      const res = await apiAskAi(userText, activeScanContext, currentHistory);

      const newAiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.answer,
        toolsUsed: res.toolsUsed || []
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

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: 0,
      bottom: 0,
      width: '440px',
      maxWidth: '100vw',
      backgroundColor: '#06142B',
      borderLeft: '1px solid rgba(45, 125, 255, 0.3)',
      boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.6)',
      zIndex: 99,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* DRAWER HEADER */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid rgba(45, 125, 255, 0.2)',
        backgroundColor: '#091B36',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ padding: '0.4rem', backgroundColor: 'rgba(25, 215, 232, 0.15)', borderRadius: '8px', color: '#19D7E8', border: '1px solid rgba(25, 215, 232, 0.3)' }}>
            <Bot size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', margin: 0, color: '#F2F5F9', fontWeight: 700 }}>XELA — Conversational AI</h3>
            {activeScanContext && (
              <span style={{ fontSize: '0.72rem', color: '#19D7E8', fontFamily: 'var(--font-mono)' }}>
                Active Target: {activeScanContext.target || activeScanContext.analysisId}
              </span>
            )}
          </div>
        </div>
        <button onClick={onClose} aria-label="Close XELA Drawer" style={{ background: 'none', border: 'none', color: '#B5C0D0', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      {/* MESSAGES CONTAINER */}
      <div 
        role="log"
        aria-live="polite"
        style={{
          flex: 1,
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          backgroundColor: '#030B1C'
        }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              backgroundColor: msg.sender === 'user' ? 'rgba(22, 136, 255, 0.18)' : 'rgba(9, 27, 54, 0.85)',
              border: msg.sender === 'user' ? '1px solid rgba(22, 136, 255, 0.4)' : '1px solid rgba(45, 125, 255, 0.25)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              fontSize: '0.85rem',
              color: '#F2F5F9'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', fontSize: '0.72rem', color: msg.sender === 'user' ? '#1688FF' : '#19D7E8', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {msg.sender === 'user' ? <User size={13} /> : <Sparkles size={13} />}
                <strong>{msg.sender === 'user' ? 'Analyst' : 'XELA'}</strong>
              </div>
              {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                <span style={{ color: '#10B981', fontSize: '0.68rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Wrench size={10} /> Tool Executed
                </span>
              )}
            </div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {msg.text}
            </div>
          </div>
        ))}

        {status === 'thinking' && (
          <div style={{ fontSize: '0.8rem', color: '#19D7E8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} className="animate-pulse" /> XELA is analyzing intent...
          </div>
        )}

        {status === 'calling_tool' && (
          <div style={{ fontSize: '0.8rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={16} className="animate-spin" /> Executing live XELOVO tool...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BOX */}
      <form onSubmit={handleSend} style={{ padding: '1rem', backgroundColor: '#06142B', borderTop: '1px solid rgba(45, 125, 255, 0.2)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(3, 11, 28, 0.7)',
          border: '1px solid rgba(45, 125, 255, 0.3)',
          borderRadius: '8px',
          padding: '0.5rem 0.75rem',
          gap: '0.5rem'
        }}>
          <textarea
            rows={1}
            placeholder={activeScanContext ? "Ask XELA about this evidence..." : "Ask XELA anything..."}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Ask XELA input"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F2F5F9',
              fontSize: '0.85rem',
              width: '100%',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
              lineHeight: 1.4
            }}
          />
          <button type="submit" aria-label="Send message" disabled={status === 'thinking' || status === 'calling_tool'} style={{ background: 'none', border: 'none', color: '#19D7E8', cursor: 'pointer' }}>
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
