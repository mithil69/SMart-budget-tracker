import React, { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const EMPTY_FORM = {
  description: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  type: 'EXPENSE',
  categoryId: '',
};

export default function TransactionsPage() {
  const { transactions, categories, formatCurrency, addTransaction, updateTransaction, deleteTransaction, getCategoryById } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterCat, setFilterCat] = useState('ALL');
  const [sortBy, setSortBy] = useState('date_desc');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const getDefaultCategoryId = (type) => {
    const match = categories.find(c => c.type === type);
    return match ? String(match.id) : '';
  };

  const openAdd = () => {
    setEditTx(null);
    setForm({ ...EMPTY_FORM, categoryId: getDefaultCategoryId(EMPTY_FORM.type) });
    setShowModal(true);
  };

  const openEdit = (tx) => {
    const fallbackCategoryId = getDefaultCategoryId(tx.type);
    const selectedCategoryId = String(tx.categoryId ?? fallbackCategoryId);
    const hasValidTypeCategory = categories.some(
      c => c.type === tx.type && String(c.id) === selectedCategoryId
    );
    setEditTx(tx);
    setForm({
      ...tx,
      categoryId: hasValidTypeCategory ? selectedCategoryId : fallbackCategoryId,
      amount: String(tx.amount),
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditTx(null); setForm(EMPTY_FORM); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, categoryId: parseInt(form.categoryId) };
    if (editTx) updateTransaction(editTx.id, payload);
    else addTransaction(payload);
    closeModal();
  };

  const filteredCats = categories.filter(c => c.type === form.type);

  const displayTx = useMemo(() => {
    let list = [...transactions];
    if (search) list = list.filter(t => t.description.toLowerCase().includes(search.toLowerCase()));
    if (filterType !== 'ALL') list = list.filter(t => t.type === filterType);
    if (filterCat !== 'ALL') list = list.filter(t => t.categoryId === parseInt(filterCat));
    switch (sortBy) {
      case 'date_desc': list.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
      case 'date_asc': list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case 'amount_desc': list.sort((a, b) => b.amount - a.amount); break;
      case 'amount_asc': list.sort((a, b) => a.amount - b.amount); break;
    }
    return list;
  }, [transactions, search, filterType, filterCat, sortBy]);

  const totalIncome = displayTx.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const totalExpense = displayTx.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Transactions</h1>
            <p className="page-subtitle">{displayTx.length} records found</p>
          </div>
          <button id="add-tx-btn" className="btn btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ padding: '14px 20px', flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Showing Income</div>
          <div className="amount-positive" style={{ fontSize: '1.2rem', fontWeight: 800 }}>+{formatCurrency(totalIncome)}</div>
        </div>
        <div className="glass-card" style={{ padding: '14px 20px', flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Showing Expenses</div>
          <div className="amount-negative" style={{ fontSize: '1.2rem', fontWeight: 800 }}>-{formatCurrency(totalExpense)}</div>
        </div>
        <div className="glass-card" style={{ padding: '14px 20px', flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Net (filtered)</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: totalIncome - totalExpense >= 0 ? 'var(--emerald-400)' : 'var(--rose-400)' }}>
            {formatCurrency(totalIncome - totalExpense)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="tx-search"
            className="form-input"
            style={{ paddingLeft: 36 }}
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select id="tx-filter-type" className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ width: 'auto' }}>
          <option value="ALL">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        <select id="tx-filter-cat" className="form-select" value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ width: 'auto' }}>
          <option value="ALL">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
        <select id="tx-sort" className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto' }}>
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="amount_desc">Highest Amount</option>
          <option value="amount_asc">Lowest Amount</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card section-card">
        <div className="data-table-wrapper">
          {displayTx.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💸</div>
              <div className="empty-state-title">No transactions found</div>
              <div className="empty-state-text">Try adjusting your filters or add a new transaction.</div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayTx.map(tx => {
                  const cat = getCategoryById(tx.categoryId);
                  return (
                    <tr key={tx.id}>
                      <td style={{ fontWeight: 500 }}>{tx.description}</td>
                      <td>
                        {cat && (
                          <span className="category-pill" style={{ background: cat.color + '20', color: cat.color }}>
                            {cat.icon} {cat.name}
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                        {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <span className={`badge badge-${tx.type.toLowerCase()}`}>
                          {tx.type === 'INCOME' ? '↑' : '↓'} {tx.type}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={tx.type === 'INCOME' ? 'amount-positive' : 'amount-negative'}>
                          {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          {confirmDelete === tx.id ? (
                            <>
                              <button className="btn btn-danger btn-sm btn-icon" onClick={() => { deleteTransaction(tx.id); setConfirmDelete(null); }} title="Confirm delete"><Check size={14} /></button>
                              <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setConfirmDelete(null)} title="Cancel"><X size={14} /></button>
                            </>
                          ) : (
                            <>
                              <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(tx)} title="Edit"><Pencil size={14} /></button>
                              <button className="btn btn-danger btn-sm btn-icon" onClick={() => setConfirmDelete(tx.id)} title="Delete"><Trash2 size={14} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editTx ? 'Edit Transaction' : 'Add Transaction'}</h2>
              <button className="modal-close" onClick={closeModal}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['INCOME', 'EXPENSE'].map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`btn ${form.type === t ? (t === 'INCOME' ? 'btn-success' : 'btn-danger') : 'btn-secondary'}`}
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => setForm(f => {
                        if (f.type === t) return f;
                        const nextCategoryId = getDefaultCategoryId(t);
                        return { ...f, type: t, categoryId: nextCategoryId };
                      })}
                    >
                      {t === 'INCOME' ? '↑ Income' : '↓ Expense'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tx-amount">Amount (₹)</label>
                <input
                  id="tx-amount"
                  type="number"
                  className="form-input"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tx-desc">Description</label>
                <input
                  id="tx-desc"
                  type="text"
                  className="form-input"
                  placeholder="What was this for?"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="tx-cat">Category</label>
                  <select
                    id="tx-cat"
                    className="form-select"
                    value={form.categoryId}
                    onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                    required
                  >
                    <option value="">Select category</option>
                    {filteredCats.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="tx-date">Date</label>
                  <input
                    id="tx-date"
                    type="date"
                    className="form-input"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={closeModal}>Cancel</button>
                <button id="tx-save-btn" type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {editTx ? 'Update' : 'Add'} Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
