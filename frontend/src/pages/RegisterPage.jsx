import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Eye, EyeOff, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = register(name, email, password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card" style={{ padding: '40px' }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Wallet size={26} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>BudgetSmart</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Financial Intelligence Platform</div>
          </div>
        </div>

        <h1 className="auth-title" style={{ fontSize: '1.4rem' }}>Start your journey 🚀</h1>
        <p className="auth-subtitle">Create a free account to take control of your finances</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><User size={15} /></span>
              <input
                id="reg-name"
                type="text"
                className="form-input"
                placeholder="Rahul Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Mail size={15} /></span>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Lock size={15} /></span>
              <input
                id="reg-password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '36px', paddingRight: '42px' }}
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

          {password && (
            <div style={{ marginBottom: 16 }}>
              <div className="progress-bar-wrapper" style={{ height: 4 }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min((password.length / 12) * 100, 100)}%`,
                    background: password.length < 6 ? 'var(--rose-500)' : password.length < 10 ? 'var(--amber-500)' : 'var(--emerald-500)',
                  }}
                />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                {password.length < 6 ? 'Too short' : password.length < 10 ? 'Moderate' : 'Strong password'}
              </div>
            </div>
          )}

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--rose-400)', fontSize: '0.82rem', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            id="register-submit-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem' }}
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <>Create Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="auth-switch" style={{ marginTop: 20 }}>
          Already have an account?{' '}
          <a href="/login" onClick={e => { e.preventDefault(); navigate('/login'); }}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
