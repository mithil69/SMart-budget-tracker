import React, { createContext, useContext, useState, useEffect } from 'react';
import { USER, TRANSACTIONS, CATEGORIES, BUDGETS } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user] = useState(USER);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('smart_budget_transactions');
    return saved ? JSON.parse(saved) : TRANSACTIONS;
  });
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('smart_budget_categories');
    return saved ? JSON.parse(saved) : CATEGORIES;
  });
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('smart_budget_budgets');
    return saved ? JSON.parse(saved) : BUDGETS;
  });
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('smart_budget_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('smart_budget_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('smart_budget_budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const addTransaction = (tx) => {
    const newTx = { ...tx, id: Date.now(), amount: parseFloat(tx.amount) };
    setTransactions(prev => [newTx, ...prev]);
    addToast('Transaction added successfully!');
    return newTx;
  };

  const updateTransaction = (id, updates) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, ...updates, amount: parseFloat(updates.amount) } : t)
    );
    addToast('Transaction updated!');
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    addToast('Transaction deleted.', 'error');
  };

  const addCategory = (cat) => {
    const newCat = { ...cat, id: Date.now() };
    setCategories(prev => [...prev, newCat]);
    addToast('Category created!');
    return newCat;
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    addToast('Category deleted.', 'error');
  };

  const saveBudget = (budget) => {
    const exists = budgets.find(
      b => b.categoryId === budget.categoryId && b.month === budget.month && b.year === budget.year
    );
    if (exists) {
      setBudgets(prev => prev.map(b => b.id === exists.id ? { ...b, limitAmount: parseFloat(budget.limitAmount) } : b));
    } else {
      setBudgets(prev => [...prev, { ...budget, id: Date.now(), limitAmount: parseFloat(budget.limitAmount) }]);
    }
    addToast('Budget saved!');
  };

  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    addToast('Budget removed.', 'error');
  };

  // Computed: total income/expense for a given month/year
  const getMonthlyStats = (month, year) => {
    const filtered = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    });
    const income = filtered.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
    const expense = filtered.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense, count: filtered.length };
  };

  // Spending by category for a given month
  const getCategorySpending = (month, year) => {
    const filtered = transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'EXPENSE' && d.getMonth() + 1 === month && d.getFullYear() === year;
    });
    const map = {};
    filtered.forEach(t => {
      map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
    });
    return categories
      .filter(c => c.type === 'EXPENSE')
      .map(c => ({ ...c, spent: map[c.id] || 0 }))
      .filter(c => c.spent > 0)
      .sort((a, b) => b.spent - a.spent);
  };

  // Monthly trend data (last 6 months)
  const getMonthlyTrend = () => {
    const months = [];
    const now = new Date(2025, 7, 1); // Aug 2025
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const stats = getMonthlyStats(m, y);
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        income: stats.income,
        expense: stats.expense,
        balance: stats.balance,
      });
    }
    return months;
  };

  const totalBalance = () => {
    const income = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
    return income - expense;
  };

  const getCategoryById = (id) => categories.find(c => c.id === id);

  const formatCurrency = (amount) => {
    return `${user.currency}${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <AppContext.Provider value={{
      user, transactions, categories, budgets, toasts,
      addTransaction, updateTransaction, deleteTransaction,
      addCategory, deleteCategory,
      saveBudget, deleteBudget,
      getMonthlyStats, getCategorySpending, getMonthlyTrend,
      totalBalance, getCategoryById, formatCurrency,
      addToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
