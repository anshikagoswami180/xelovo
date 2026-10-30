import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { apiRegister } from '../utils/api';
import XCoreLogo from '../components/XCoreLogo';

export default function RegisterPage({ setUser }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiRegister(email, password, fullName);
      setUser(res.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem 2rem',
        boxShadow: '0 0 40px rgba(0, 240, 255, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <XCoreLogo size={44} />
          <h2 style={{ fontSize: '1.5rem', marginTop: '0.75rem' }}>Register Analyst Account</h2>
          <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: '0.25rem' }}>XELOVO Security & Intelligence Platform</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#D1D5DB', display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '0.65rem 0.85rem', gap: '0.6rem' }}>
              <User size={18} color="#9CA3AF" />
              <input
                type="text"
                required
                placeholder="e.g. Alex Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '0.9rem', width: '100%', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#D1D5DB', display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '0.65rem 0.85rem', gap: '0.6rem' }}>
              <Mail size={18} color="#9CA3AF" />
              <input
                type="email"
                required
                placeholder="analyst@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '0.9rem', width: '100%', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#D1D5DB', display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '0.65rem 0.85rem', gap: '0.6rem' }}>
              <Lock size={18} color="#9CA3AF" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '0.9rem', width: '100%', outline: 'none' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
            {loading ? 'Creating Account...' : 'Register Account'} <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ fontSize: '0.82rem', color: '#9CA3AF', textAlign: 'center', marginTop: '1.5rem' }}>
          Already registered? <Link to="/login" style={{ color: '#00F0FF', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
