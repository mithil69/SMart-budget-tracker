import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, PieChart, Target,
  Tag, LogOut, Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/analytics', icon: PieChart, label: 'Analytics' },
  { to: '/budgets', icon: Target, label: 'Budgets' },
  { to: '/categories', icon: Tag, label: 'Categories' },
];

export default function Sidebar() {
  const { authUser, logout } = useAuth();
  const { formatCurrency, totalBalance } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = authUser?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Wallet size={20} color="white" />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title">BudgetSmart</span>
          <span className="sidebar-logo-sub">Financial Tracker</span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '24px', background: 'rgba(168,85,247,0.08)', borderColor: 'rgba(168,85,247,0.2)' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
          Net Balance
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--purple-400)', letterSpacing: '-0.02em' }}>
          {formatCurrency(totalBalance())}
        </div>
      </div>

      {/* Nav */}
      <div className="sidebar-section-label">Navigation</div>

      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <Icon size={18} className="nav-item-icon" />
          {label}
        </NavLink>
      ))}

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-badge" style={{ marginBottom: 8 }}>
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{authUser?.name}</div>
            <div className="user-email">{authUser?.email}</div>
          </div>
        </div>
        <button
          className="nav-item btn-danger"
          style={{ width: '100%', border: 'none', background: 'none' }}
          onClick={handleLogout}
          id="logout-btn"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
