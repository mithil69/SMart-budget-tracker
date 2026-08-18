import React, { useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Wallet, Activity,
  ArrowUpRight, ArrowDownRight, Plus, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const CURRENT_MONTH = 8;
const CURRENT_YEAR = 2025;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-custom" style={{ background: 'rgba(15,15,30,0.95)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: '0.85rem', fontWeight: 600 }}>
          {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const {
    transactions, categories, formatCurrency,
    getMonthlyStats, getCategorySpending, getMonthlyTrend, totalBalance
  } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => getMonthlyStats(CURRENT_MONTH, CURRENT_YEAR), [getMonthlyStats]);
  const prevStats = useMemo(() => getMonthlyStats(7, 2025), [getMonthlyStats]);
  const trendData = useMemo(() => getMonthlyTrend(), [getMonthlyTrend]);
  const categorySpend = useMemo(() => getCategorySpending(CURRENT_MONTH, CURRENT_YEAR), [getCategorySpending]);

  const recentTx = useMemo(() =>
    [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6),
    [transactions]
  );

  const pieData = categorySpend.slice(0, 6).map(c => ({
    name: c.name,
    value: c.spent,
    color: c.color,
  }));

  const incomeChange = prevStats.income > 0
    ? ((stats.income - prevStats.income) / prevStats.income * 100).toFixed(1)
    : 0;
  const expenseChange = prevStats.expense > 0
    ? ((stats.expense - prevStats.expense) / prevStats.expense * 100).toFixed(1)
    : 0;

  const getCat = (id) => categories.find(c => c.id === id);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">
              Financial <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="page-subtitle">Overview for August 2025</p>
          </div>
          <button
            id="add-transaction-btn"
            className="btn btn-primary"
            onClick={() => navigate('/transactions')}
          >
            <Plus size={16} /> Add Transaction
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card purple">
          <div className="stat-icon purple"><Wallet size={18} /></div>
          <div className="stat-label">Net Balance</div>
          <div className="stat-value purple">{formatCurrency(totalBalance())}</div>
          <div className="stat-change up">
            <TrendingUp size={12} /> All time savings
          </div>
        </div>

        <div className="glass-card stat-card emerald">
          <div className="stat-icon emerald"><TrendingUp size={18} /></div>
          <div className="stat-label">Monthly Income</div>
          <div className="stat-value emerald">{formatCurrency(stats.income)}</div>
          <div className={`stat-change ${incomeChange >= 0 ? 'up' : 'down'}`}>
            {incomeChange >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(incomeChange)}% vs last month
          </div>
        </div>

        <div className="glass-card stat-card rose">
          <div className="stat-icon rose"><TrendingDown size={18} /></div>
          <div className="stat-label">Monthly Expenses</div>
          <div className="stat-value rose">{formatCurrency(stats.expense)}</div>
          <div className={`stat-change ${expenseChange <= 0 ? 'up' : 'down'}`}>
            {expenseChange <= 0 ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
            {Math.abs(expenseChange)}% vs last month
          </div>
        </div>

        <div className="glass-card stat-card amber">
          <div className="stat-icon amber"><Activity size={18} /></div>
          <div className="stat-label">Transactions</div>
          <div className="stat-value amber">{stats.count}</div>
          <div className="stat-change up">
            <TrendingUp size={12} /> This month
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="two-col" style={{ marginBottom: 24 }}>
        {/* Area Chart */}
        <div className="glass-card section-card">
          <div className="section-header">
            <div>
              <div className="section-title">Income vs Expenses</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>6-month trend</div>
            </div>
          </div>
          <div style={{ padding: '24px 8px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} fill="url(#gradIncome)" dot={{ fill: '#10b981', r: 3 }} />
                <Area type="monotone" dataKey="expense" name="Expense" stroke="#f43f5e" strokeWidth={2} fill="url(#gradExpense)" dot={{ fill: '#f43f5e', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card section-card">
          <div className="section-header">
            <div>
              <div className="section-title">Spending by Category</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>This month</div>
            </div>
          </div>
          <div style={{ padding: '12px 8px' }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, '']} contentStyle={{ background: 'rgba(15,15,30,0.95)', border: '1px solid var(--border)', borderRadius: 10 }} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card section-card">
        <div className="section-header">
          <div className="section-title">Recent Transactions</div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/transactions')}
          >
            View All <ChevronRight size={14} />
          </button>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map(tx => {
                const cat = getCat(tx.categoryId);
                return (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{tx.description}</div>
                    </td>
                    <td>
                      {cat && (
                        <span className="category-pill" style={{ background: cat.color + '20', color: cat.color }}>
                          <span>{cat.icon}</span> {cat.name}
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
