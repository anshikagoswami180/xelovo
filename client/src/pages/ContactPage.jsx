import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Copy, Check, Send, ShieldAlert, User, Code2, ArrowRight, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [selectedCategory, setSelectedCategory] = useState('General Inquiry');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [copied, setCopied] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState(null);

  const officialEmail = 'xelavo.sec26@gmail.com';

  const categories = [
    'General Inquiry',
    'Technical Support',
    'Security Vulnerability Report',
    'Tool Feedback',
    'Partnership / Collaboration'
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(officialEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmittedStatus({ error: true, text: 'Please complete all required fields (Name, Email, Message).' });
      return;
    }

    const mailtoSubject = encodeURIComponent(`[${selectedCategory}] ${formData.subject || 'Platform Inquiry'}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCategory: ${selectedCategory}\n\nMessage:\n${formData.message}`
    );

    // Trigger local mailto client
    window.location.href = `mailto:${officialEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

    setSubmittedStatus({
      error: false,
      text: `Opening your email application to send directly to ${officialEmail}. If your mail client does not launch automatically, please send your email manually.`
    });
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* PAGE HEADER */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#1688FF', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            GET IN TOUCH
          </span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: '#F2F5F9', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
          Contact XELOVO
        </h1>
        <p style={{ fontSize: '1rem', color: '#B5C0D0', marginTop: '0.4rem', maxWidth: '800px', lineHeight: 1.6 }}>
          For platform questions, technical feedback, security-related concerns, tool feedback, responsible vulnerability disclosure, or collaboration inquiries, contact the XELOVO team through the official platform email.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* LEFT COLUMN: OFFICIAL EMAIL & TEAM SUMMARY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* OFFICIAL EMAIL CARD */}
          <div className="xelavo-card" style={{ padding: '1.75rem', backgroundColor: '#091B36', borderLeft: '4px solid #19D7E8' }}>
            <span style={{ fontSize: '0.78rem', color: '#8494AB', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              OFFICIAL PLATFORM EMAIL
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', gap: '1rem', flexWrap: 'wrap' }}>
              <a 
                href={`mailto:${officialEmail}`}
                style={{
                  fontSize: '1.15rem',
                  color: '#19D7E8',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Mail size={22} color="#19D7E8" />
                {officialEmail}
              </a>
              <button
                onClick={handleCopyEmail}
                className="btn-outline-electric"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                title="Copy Email Address"
              >
                {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#B5C0D0', marginTop: '0.85rem', margin: '0.85rem 0 0 0', lineHeight: 1.5 }}>
              Clicking the email link above will launch your native mail client with recipient address pre-filled.
            </p>
          </div>

          {/* TEAM SUMMARY CARD */}
          <div className="xelavo-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#F2F5F9', marginBottom: '1rem', fontWeight: 700 }}>
              XELOVO Core Team
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(25, 215, 232, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#19D7E8' }}>
                  <User size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#F2F5F9', margin: 0, fontWeight: 700 }}>Anshika G.</h4>
                  <p style={{ fontSize: '0.78rem', color: '#19D7E8', margin: 0 }}>Founder & Lead Platform Architect</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(22, 136, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1688FF' }}>
                  <Code2 size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#F2F5F9', margin: 0, fontWeight: 700 }}>Dhruvi Solanki</h4>
                  <p style={{ fontSize: '0.78rem', color: '#1688FF', margin: 0 }}>Technical Lead & Frontend Developer</p>
                </div>
              </div>
            </div>

            <Link 
              to="/about"
              style={{
                fontSize: '0.86rem',
                color: '#19D7E8',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              Learn more about the team <ArrowRight size={15} />
            </Link>
          </div>

          {/* RESPONSIBLE VULNERABILITY DISCLOSURE */}
          <div className="xelavo-card" style={{ padding: '1.5rem', backgroundColor: 'rgba(249, 115, 22, 0.08)', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
            <h3 style={{ fontSize: '1rem', color: '#F97316', marginBottom: '0.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} color="#F97316" /> Responsible Vulnerability Disclosure
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#B5C0D0', lineHeight: 1.5, margin: 0 }}>
              Found a potential security weakness in XELOVO? We encourage responsible defensive research. Please submit findings to <strong>xelavo.sec26@gmail.com</strong> with steps to reproduce. Please avoid destructive testing or accessing unauthorized user data.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE INQUIRY FORM */}
        <div className="xelavo-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#F2F5F9', marginBottom: '1.25rem', fontWeight: 700 }}>
            Send Platform Inquiry
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* CATEGORY SELECTOR */}
            <div>
              <label style={{ fontSize: '0.82rem', color: '#B5C0D0', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                Inquiry Category
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isSelected ? 'rgba(25, 215, 232, 0.18)' : 'rgba(3, 11, 28, 0.6)',
                        color: isSelected ? '#19D7E8' : '#B5C0D0',
                        border: isSelected ? '1px solid rgba(25, 215, 232, 0.5)' : '1px solid rgba(45, 125, 255, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NAME & EMAIL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#B5C0D0', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

              <div>
                <label style={{ fontSize: '0.82rem', color: '#B5C0D0', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

            {/* SUBJECT */}
            <div>
              <label style={{ fontSize: '0.82rem', color: '#B5C0D0', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                Subject Title (Optional)
              </label>
              <input
                type="text"
                placeholder="Brief summary of your inquiry..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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

            {/* MESSAGE */}
            <div>
              <label style={{ fontSize: '0.82rem', color: '#B5C0D0', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                Message Content *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Provide detailed information regarding your inquiry or technical feedback..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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

            {/* STATUS NOTIFICATION */}
            {submittedStatus && (
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                backgroundColor: submittedStatus.error ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                border: submittedStatus.error ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                color: submittedStatus.error ? '#EF4444' : '#10B981'
              }}>
                {submittedStatus.text}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="btn-blue-gradient"
              style={{
                padding: '0.8rem 1.75rem',
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem'
              }}
            >
              <Send size={16} /> Launch Email Client
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
