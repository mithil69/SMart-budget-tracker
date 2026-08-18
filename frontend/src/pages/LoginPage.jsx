import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Eye, EyeOff, ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: <TrendingUp size={18} />, text: 'Real-time spending analytics' },
  { icon: <Shield size={18} />, text: 'Secure JWT authentication' },
  { icon: <Zap size={18} />, text: 'Smart budget alerts' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('demo@budgetsmart.in');
  const [password, setPassword] = useState('demo123');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card" style={{ padding: '40px' }}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Wallet size={26} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              BudgetSmart
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Financial Intelligence Platform</div>
          </div>
        </div>

        <h1 className="auth-title" style={{ fontSize: '1.4rem' }}>Welcome back 👋</h1>
        <p className="auth-subtitle">Sign in to track your financial journey</p>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--purple-400)' }}>{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ paddingRight: '42px' }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--rose-400)', fontSize: '0.82rem', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem' }}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="auth-switch">
          Don't have an account?{' '}
          <a href="/register" onClick={e => { e.preventDefault(); navigate('/register'); }}>
            Create one free
          </a>
        </div>

        <div style={{ marginTop: 20, padding: '10px', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          💡 Demo: use any email + password (min 6 chars)
        </div>
      </div>
    </div>
  );
}
