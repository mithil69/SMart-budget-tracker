import React, { useState, useMemo } from 'react';
import { Plus, Target, AlertTriangle, CheckCircle, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CURRENT_MONTH = 8;
const CURRENT_YEAR = 2025;

export default function BudgetsPage() {
  const { budgets, categories, transactions, formatCurrency, saveBudget, deleteBudget } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ categoryId: '', limitAmount: '', month: CURRENT_MONTH, year: CURRENT_YEAR });

  const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

  // Monthly spending per category
  const spendingMap = useMemo(() => {
    const map = {};
    transactions.forEach(tx => {
      const d = new Date(tx.date);
      if (tx.type === 'EXPENSE' && d.getMonth() + 1 === CURRENT_MONTH && d.getFullYear() === CURRENT_YEAR) {
        map[tx.categoryId] = (map[tx.categoryId] || 0) + tx.amount;
      }
    });
    return map;
  }, [transactions]);

  // Budgets for current month
  const currentBudgets = useMemo(() => {
    return budgets
      .filter(b => b.month === CURRENT_MONTH && b.year === CURRENT_YEAR)
      .map(b => {
        const cat = categories.find(c => c.id === b.categoryId);
        const spent = spendingMap[b.categoryId] || 0;
        const pct = Math.min(Math.round((spent / b.limitAmount) * 100), 100);
        const over = spent > b.limitAmount;
        return { ...b, cat, spent, pct, over };
      });
  }, [budgets, categories, spendingMap]);

  const totalBudgeted = currentBudgets.reduce((s, b) => s + b.limitAmount, 0);
  const totalSpent = currentBudgets.reduce((s, b) => s + b.spent, 0);
  const overBudgetCount = currentBudgets.filter(b => b.over).length;

  const openModal = () => {
    setForm({ categoryId: '', limitAmount: '', month: CURRENT_MONTH, year: CURRENT_YEAR });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveBudget({ ...form, categoryId: parseInt(form.categoryId) });
    setShowModal(false);
  };

  const getProgressColor = (pct, over) => {
    if (over) return 'var(--rose-500)';
    if (pct >= 80) return 'var(--amber-500)';
    return 'var(--emerald-500)';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Budget <span className="gradient-text">Goals</span></h1>
            <p className="page-subtitle">August 2025 — Set and track your spending limits</p>
          </div>
          <button id="add-budget-btn" className="btn btn-primary" onClick={openModal}>
            <Plus size={16} /> Set Budget
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="glass-card stat-card purple" style={{ padding: '20px' }}>
          <div className="stat-label">Total Budgeted</div>
          <div className="stat-value purple">{formatCurrency(totalBudgeted)}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>across {currentBudgets.length} categories</div>
        </div>
        <div className="glass-card stat-card rose" style={{ padding: '20px' }}>
          <div className="stat-label">Total Spent</div>
          <div className="stat-value rose">{formatCurrency(totalSpent)}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{Math.round((totalSpent / totalBudgeted) * 100) || 0}% of budget used</div>
        </div>
        <div className="glass-card stat-card emerald" style={{ padding: '20px' }}>
          <div className="stat-label">Remaining</div>
          <div className="stat-value emerald">{formatCurrency(Math.max(totalBudgeted - totalSpent, 0))}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>available to spend</div>
        </div>
        <div className={`glass-card stat-card ${overBudgetCount > 0 ? 'amber' : 'emerald'}`} style={{ padding: '20px' }}>
          <div className="stat-label">Over Budget</div>
          <div className={`stat-value ${overBudgetCount > 0 ? 'amber' : 'emerald'}`}>{overBudgetCount}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>categories exceeded</div>
        </div>
      </div>

      {/* Overall progress */}
      {totalBudgeted > 0 && (
        <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Overall Budget Usage</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {formatCurrency(totalSpent)} / {formatCurrency(totalBudgeted)}
            </div>
          </div>
          <div className="progress-bar-wrapper" style={{ height: 12 }}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min((totalSpent / totalBudgeted) * 100, 100)}%`,
                background: totalSpent > totalBudgeted ? 'var(--rose-500)' : totalSpent / totalBudgeted > 0.8 ? 'var(--amber-500)' : 'var(--grad-emerald)',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>0%</span>
            <span style={{ color: totalSpent > totalBudgeted ? 'var(--rose-400)' : 'var(--text-muted)' }}>
              {Math.round((totalSpent / totalBudgeted) * 100)}% used
            </span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* Budget Cards */}
      {currentBudgets.length === 0 ? (
        <div className="glass-card">
          <div className="empty-state">
            <div className="empty-state-icon"><Target size={40} /></div>
            <div className="empty-state-title">No budgets set yet</div>
            <div className="empty-state-text">Set monthly spending limits for your expense categories to stay on track.</div>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={openModal}>
              <Plus size={16} /> Set Your First Budget
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card section-card">
          <div className="section-header">
            <div className="section-title">Category Budgets</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>August 2025</span>
          </div>
          {currentBudgets.map(b => (
            <div key={b.id} className="budget-card-item">
              <div className="budget-meta">
                <div className="budget-label">
                  <div className="category-dot" style={{ background: b.cat?.color || '#888', width: 12, height: 12 }} />
                  <span style={{ fontSize: '1.1rem' }}>{b.cat?.icon}</span>
                  {b.cat?.name || 'Unknown'}
                  {b.over && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: 'var(--rose-400)', fontWeight: 500 }}>
                      <AlertTriangle size={12} /> Over budget!
                    </span>
                  )}
                  {!b.over && b.pct >= 80 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: 'var(--amber-400)', fontWeight: 500 }}>
                      <AlertTriangle size={12} /> Near limit
                    </span>
                  )}
                  {!b.over && b.pct < 80 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: 'var(--emerald-400)', fontWeight: 500 }}>
                      <CheckCircle size={12} /> On track
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="budget-amounts">
                    <span style={{ color: getProgressColor(b.pct, b.over), fontWeight: 700 }}>{formatCurrency(b.spent)}</span>
                    <span style={{ color: 'var(--text-muted)' }}> / {formatCurrency(b.limitAmount)}</span>
                  </div>
                  <button
                    className="btn btn-danger btn-sm btn-icon"
                    onClick={() => deleteBudget(b.id)}
                    title="Remove budget"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="progress-bar-wrapper">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${b.pct}%`, background: getProgressColor(b.pct, b.over) }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>{b.pct}% used</span>
                <span>{b.over ? 'Overspent by ' + formatCurrency(b.spent - b.limitAmount) : formatCurrency(b.limitAmount - b.spent) + ' remaining'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Set Monthly Budget</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="budget-cat">Expense Category</label>
                <select
                  id="budget-cat"
                  className="form-select"
                  value={form.categoryId}
                  onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                  required
                >
                  <option value="">Select a category</option>
                  {expenseCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="budget-limit">Monthly Limit (₹)</label>
                <input
                  id="budget-limit"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 5000"
                  min="1"
                  value={form.limitAmount}
                  onChange={e => setForm(f => ({ ...f, limitAmount: e.target.value }))}
                  required
                />
                {form.categoryId && spendingMap[parseInt(form.categoryId)] && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--amber-400)', marginTop: 4 }}>
                    ⚠️ Already spent {formatCurrency(spendingMap[parseInt(form.categoryId)])} this month
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button id="budget-save-btn" type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
