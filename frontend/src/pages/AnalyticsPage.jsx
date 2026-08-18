import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, Radar
} from 'recharts';
import { useApp } from '../context/AppContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(15,15,30,0.97)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: '0.85rem', fontWeight: 600 }}>
          {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { transactions, categories, formatCurrency, getMonthlyTrend, getCategorySpending } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(8);

  const trendData = useMemo(() => getMonthlyTrend(), [getMonthlyTrend]);
  const catSpend = useMemo(() => getCategorySpending(selectedMonth, 2025), [getCategorySpending, selectedMonth]);

  // Savings rate
  const savingsData = useMemo(() => {
    return trendData.map(d => ({
      name: d.name,
      savings: Math.max(d.income - d.expense, 0),
      rate: d.income > 0 ? Math.round(((d.income - d.expense) / d.income) * 100) : 0,
    }));
  }, [trendData]);

  // Top spending categories
  const topCats = catSpend.slice(0, 8);

  // Radar data
  const radarData = topCats.slice(0, 6).map(c => ({
    subject: c.name,
    amount: c.spent,
    fullMark: Math.max(...topCats.map(x => x.spent)),
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Analytics & <span className="gradient-text">Insights</span></h1>
            <p className="page-subtitle">Deep dive into your spending patterns</p>
          </div>
          <select
            id="analytics-month-select"
            className="form-select"
            value={selectedMonth}
            onChange={e => setSelectedMonth(parseInt(e.target.value))}
            style={{ width: 'auto' }}
          >
            {[5,6,7,8].map(m => (
              <option key={m} value={m}>
                {new Date(2025, m - 1).toLocaleString('default', { month: 'long' })} 2025
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {(() => {
          const idx = trendData.length - 1;
          const cur = trendData[idx];
          const sr = cur?.income > 0 ? Math.round(((cur.income - cur.expense) / cur.income) * 100) : 0;
          return [
            { label: 'Savings Rate', value: `${sr}%`, color: 'emerald', desc: 'of income saved' },
            { label: 'Avg Daily Spend', value: formatCurrency(Math.round((trendData[idx]?.expense || 0) / 30)), color: 'amber', desc: 'per day this month' },
            { label: 'Top Category', value: catSpend[0]?.name || 'N/A', color: 'rose', desc: `${catSpend[0] ? formatCurrency(catSpend[0].spent) : '—'} spent` },
            { label: 'Months Tracked', value: trendData.length, color: 'purple', desc: 'total data points' },
          ];
        })().map((item, i) => (
          <div key={i} className={`glass-card stat-card ${item.color}`} style={{ padding: '20px' }}>
            <div className="stat-label">{item.label}</div>
            <div className={`stat-value ${item.color}`} style={{ fontSize: '1.5rem' }}>{item.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Income vs Expense Bar Chart */}
      <div className="glass-card section-card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <div>
            <div className="section-title">Monthly Income vs Expenses</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Side-by-side comparison</div>
          </div>
        </div>
        <div style={{ padding: '24px 8px' }}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }} />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="two-col" style={{ marginBottom: 24 }}>
        {/* Savings Trend Line */}
        <div className="glass-card section-card">
          <div className="section-header">
            <div>
              <div className="section-title">Savings Trend</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Monthly savings amount</div>
            </div>
          </div>
          <div style={{ padding: '24px 8px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={savingsData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="savings" name="Savings" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: '#a855f7', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie */}
        <div className="glass-card section-card">
          <div className="section-header">
            <div>
              <div className="section-title">Expense Breakdown</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {new Date(2025, selectedMonth - 1).toLocaleString('default', { month: 'long' })}
              </div>
            </div>
          </div>
          <div style={{ padding: '12px 8px' }}>
            {topCats.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px' }}>
                <div className="empty-state-icon">📊</div>
                <div className="empty-state-title">No expense data</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={topCats.slice(0, 6)} dataKey="spent" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>
                    {topCats.slice(0, 6).map((c, i) => <Cell key={i} fill={c.color} stroke="transparent" />)}
                  </Pie>
                  <Tooltip formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, '']} contentStyle={{ background: 'rgba(15,15,30,0.95)', border: '1px solid var(--border)', borderRadius: 10 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Category Spending Bar */}
      <div className="glass-card section-card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <div className="section-title">Category-wise Spending</div>
        </div>
        <div style={{ padding: 24 }}>
          {topCats.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px' }}>
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-title">No data for selected month</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {topCats.map((c, i) => {
                const max = topCats[0].spent;
                const pct = Math.round((c.spent / max) * 100);
                return (
                  <div key={c.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {c.icon} {c.name}
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: c.color }}>
                        {formatCurrency(c.spent)}
                      </span>
                    </div>
                    <div className="progress-bar-wrapper">
                      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: c.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
