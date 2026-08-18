import React, { useState } from 'react';
import { Plus, Trash2, X, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PRESET_COLORS = [
  '#a855f7', '#10b981', '#f43f5e', '#f59e0b', '#38bdf8',
  '#6366f1', '#ec4899', '#fb923c', '#14b8a6', '#8b5cf6',
];

const PRESET_ICONS = ['💼', '💻', '📈', '🏠', '🍔', '🚗', '🛍️', '🎬', '💊', '⚡', '📚', '🏢', '✈️', '🎮', '🎵', '💇', '🐾', '🌿'];

const EMPTY_FORM = { name: '', icon: '💼', color: '#a855f7', type: 'EXPENSE' };

export default function CategoriesPage() {
  const { categories, addCategory, deleteCategory, transactions } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tab, setTab] = useState('EXPENSE');

  const filtered = categories.filter(c => c.type === tab);

  const getTxCount = (catId) => transactions.filter(t => t.categoryId === catId).length;
  const getTotalSpent = (catId) => transactions.filter(t => t.categoryId === catId).reduce((s, t) => s + t.amount, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    addCategory(form);
    setShowModal(false);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Categories</h1>
            <p className="page-subtitle">Organise your income and expenses</p>
          </div>
          <button id="add-category-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Category
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['EXPENSE', 'INCOME'].map(t => (
          <button
            key={t}
            id={`cat-tab-${t.toLowerCase()}`}
            className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(t)}
          >
            {t === 'EXPENSE' ? '↓ Expense' : '↑ Income'} ({categories.filter(c => c.type === t).length})
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card">
          <div className="empty-state">
            <div className="empty-state-icon"><Tag size={40} /></div>
            <div className="empty-state-title">No {tab.toLowerCase()} categories</div>
            <div className="empty-state-text">Create categories to organise your transactions better.</div>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setShowModal(true)}>
              <Plus size={16} /> Create Category
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {filtered.map(cat => {
            const txCount = getTxCount(cat.id);
            const total = getTotalSpent(cat.id);
            const isBuiltIn = cat.id <= 12; // mock data IDs
            return (
              <div key={cat.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
                {/* Color accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: cat.color, borderRadius: '16px 16px 0 0' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-md)',
                      background: cat.color + '20',
                      border: `1px solid ${cat.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.4rem',
                    }}>
                      {cat.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{cat.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {txCount} transaction{txCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {!isBuiltIn && (
                    <button
                      className="btn btn-danger btn-sm btn-icon"
                      onClick={() => deleteCategory(cat.id)}
                      title="Delete category"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${tab === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                    {tab === 'INCOME' ? '↑ Income' : '↓ Expense'}
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: cat.color }}>
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>

                {isBuiltIn && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '4px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    Built-in category
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">New Category</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['EXPENSE', 'INCOME'].map(t => (
                    <button key={t} type="button"
                      className={`btn ${form.type === t ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => setForm(f => ({ ...f, type: t }))}
                    >
                      {t === 'EXPENSE' ? '↓ Expense' : '↑ Income'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cat-name">Category Name</label>
                <input
                  id="cat-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Gym, Pet Care..."
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {PRESET_ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, icon }))}
                      style={{
                        width: 38, height: 38, borderRadius: 'var(--radius-sm)', fontSize: '1.2rem',
                        background: form.icon === icon ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${form.icon === icon ? 'rgba(168,85,247,0.4)' : 'transparent'}`,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, color }))}
                      style={{
                        width: 30, height: 30, borderRadius: '50%', background: color, cursor: 'pointer',
                        border: `3px solid ${form.color === color ? 'white' : 'transparent'}`,
                        outline: form.color === color ? `2px solid ${color}` : 'none',
                        transition: 'all 0.15s',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ padding: '14px', background: form.color + '15', border: `1px solid ${form.color}30`, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: form.color + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                  {form.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: form.color }}>{form.name || 'Category Name'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{form.type}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button id="cat-save-btn" type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
