// ============================================================
// Mock Data — Realistic financial dataset for the Budget Tracker
// ============================================================

export const CATEGORIES = [
  { id: 1, name: 'Salary', icon: '💼', color: '#a855f7', type: 'INCOME' },
  { id: 2, name: 'Freelance', icon: '💻', color: '#8b5cf6', type: 'INCOME' },
  { id: 3, name: 'Investments', icon: '📈', color: '#6d28d9', type: 'INCOME' },
  { id: 4, name: 'Rental Income', icon: '🏠', color: '#7c3aed', type: 'INCOME' },
  { id: 5, name: 'Food & Dining', icon: '🍔', color: '#f43f5e', type: 'EXPENSE' },
  { id: 6, name: 'Transportation', icon: '🚗', color: '#fb923c', type: 'EXPENSE' },
  { id: 7, name: 'Shopping', icon: '🛍️', color: '#f59e0b', type: 'EXPENSE' },
  { id: 8, name: 'Entertainment', icon: '🎬', color: '#ec4899', type: 'EXPENSE' },
  { id: 9, name: 'Health', icon: '💊', color: '#10b981', type: 'EXPENSE' },
  { id: 10, name: 'Utilities', icon: '⚡', color: '#38bdf8', type: 'EXPENSE' },
  { id: 11, name: 'Education', icon: '📚', color: '#6366f1', type: 'EXPENSE' },
  { id: 12, name: 'Rent', icon: '🏢', color: '#ef4444', type: 'EXPENSE' },
];

export const TRANSACTIONS = [
  // August 2025
  { id: 1, amount: 85000, description: 'Monthly Salary - TCS', date: '2025-08-01', type: 'INCOME', categoryId: 1 },
  { id: 2, amount: 15000, description: 'Freelance UI Design - Client A', date: '2025-08-03', type: 'INCOME', categoryId: 2 },
  { id: 3, amount: 22000, description: 'Apartment Rent', date: '2025-08-05', type: 'EXPENSE', categoryId: 12 },
  { id: 4, amount: 4500, description: 'Groceries - D-Mart', date: '2025-08-07', type: 'EXPENSE', categoryId: 5 },
  { id: 5, amount: 2800, description: 'Electricity Bill', date: '2025-08-08', type: 'EXPENSE', categoryId: 10 },
  { id: 6, amount: 1200, description: 'Swiggy / Zomato Orders', date: '2025-08-10', type: 'EXPENSE', categoryId: 5 },
  { id: 7, amount: 3200, description: 'Fuel - Petrol', date: '2025-08-11', type: 'EXPENSE', categoryId: 6 },
  { id: 8, amount: 8500, description: 'Amazon Shopping - Electronics', date: '2025-08-12', type: 'EXPENSE', categoryId: 7 },
  { id: 9, amount: 5000, description: 'Mutual Fund Returns', date: '2025-08-14', type: 'INCOME', categoryId: 3 },
  { id: 10, amount: 1500, description: 'Netflix + Spotify', date: '2025-08-15', type: 'EXPENSE', categoryId: 8 },
  { id: 11, amount: 2200, description: 'Doctor Consultation + Medicines', date: '2025-08-16', type: 'EXPENSE', categoryId: 9 },
  { id: 12, amount: 4000, description: 'Online Course - Udemy', date: '2025-08-18', type: 'EXPENSE', categoryId: 11 },
  { id: 13, amount: 1800, description: 'Uber / Ola Rides', date: '2025-08-19', type: 'EXPENSE', categoryId: 6 },
  { id: 14, amount: 6000, description: 'Clothes Shopping', date: '2025-08-20', type: 'EXPENSE', categoryId: 7 },
  { id: 15, amount: 3500, description: 'Restaurant Dinner', date: '2025-08-22', type: 'EXPENSE', categoryId: 5 },
  // July 2025
  { id: 16, amount: 85000, description: 'Monthly Salary - TCS', date: '2025-07-01', type: 'INCOME', categoryId: 1 },
  { id: 17, amount: 12000, description: 'Freelance Backend Project', date: '2025-07-05', type: 'INCOME', categoryId: 2 },
  { id: 18, amount: 22000, description: 'Apartment Rent', date: '2025-07-05', type: 'EXPENSE', categoryId: 12 },
  { id: 19, amount: 3800, description: 'Groceries', date: '2025-07-08', type: 'EXPENSE', categoryId: 5 },
  { id: 20, amount: 2500, description: 'Internet + Water Bill', date: '2025-07-10', type: 'EXPENSE', categoryId: 10 },
  { id: 21, amount: 2200, description: 'Petrol', date: '2025-07-12', type: 'EXPENSE', categoryId: 6 },
  { id: 22, amount: 5000, description: 'Flipkart Sale', date: '2025-07-14', type: 'EXPENSE', categoryId: 7 },
  { id: 23, amount: 8000, description: 'Rental Income', date: '2025-07-15', type: 'INCOME', categoryId: 4 },
  { id: 24, amount: 1500, description: 'OTT Subscriptions', date: '2025-07-16', type: 'EXPENSE', categoryId: 8 },
  { id: 25, amount: 3200, description: 'Hospital Checkup', date: '2025-07-20', type: 'EXPENSE', categoryId: 9 },
  // June 2025
  { id: 26, amount: 85000, description: 'Monthly Salary - TCS', date: '2025-06-01', type: 'INCOME', categoryId: 1 },
  { id: 27, amount: 20000, description: 'Freelance Mobile App', date: '2025-06-07', type: 'INCOME', categoryId: 2 },
  { id: 28, amount: 22000, description: 'Apartment Rent', date: '2025-06-05', type: 'EXPENSE', categoryId: 12 },
  { id: 29, amount: 4200, description: 'Groceries', date: '2025-06-09', type: 'EXPENSE', categoryId: 5 },
  { id: 30, amount: 3100, description: 'Electric + Gas Bills', date: '2025-06-11', type: 'EXPENSE', categoryId: 10 },
  { id: 31, amount: 2800, description: 'Fuel', date: '2025-06-13', type: 'EXPENSE', categoryId: 6 },
  { id: 32, amount: 9000, description: 'Weekend Trip Shopping', date: '2025-06-15', type: 'EXPENSE', categoryId: 7 },
  { id: 33, amount: 6000, description: 'Stocks Dividend', date: '2025-06-18', type: 'INCOME', categoryId: 3 },
  { id: 34, amount: 2000, description: 'Movies + Gaming', date: '2025-06-20', type: 'EXPENSE', categoryId: 8 },
  // May 2025
  { id: 35, amount: 85000, description: 'Monthly Salary - TCS', date: '2025-05-01', type: 'INCOME', categoryId: 1 },
  { id: 36, amount: 8000, description: 'Freelance Design', date: '2025-05-10', type: 'INCOME', categoryId: 2 },
  { id: 37, amount: 22000, description: 'Apartment Rent', date: '2025-05-05', type: 'EXPENSE', categoryId: 12 },
  { id: 38, amount: 5500, description: 'Monthly Groceries', date: '2025-05-08', type: 'EXPENSE', categoryId: 5 },
  { id: 39, amount: 2200, description: 'Utility Bills', date: '2025-05-12', type: 'EXPENSE', categoryId: 10 },
  { id: 40, amount: 3500, description: 'Petrol + Parking', date: '2025-05-14', type: 'EXPENSE', categoryId: 6 },
  { id: 41, amount: 7500, description: 'Amazon Shopping', date: '2025-05-16', type: 'EXPENSE', categoryId: 7 },
  { id: 42, amount: 1800, description: 'Subscriptions', date: '2025-05-18', type: 'EXPENSE', categoryId: 8 },
  { id: 43, amount: 8000, description: 'Rental Income', date: '2025-05-20', type: 'INCOME', categoryId: 4 },
];

export const BUDGETS = [
  { id: 1, categoryId: 5, limitAmount: 10000, month: 8, year: 2025 },
  { id: 2, categoryId: 6, limitAmount: 5000, month: 8, year: 2025 },
  { id: 3, categoryId: 7, limitAmount: 12000, month: 8, year: 2025 },
  { id: 4, categoryId: 8, limitAmount: 3000, month: 8, year: 2025 },
  { id: 5, categoryId: 9, limitAmount: 4000, month: 8, year: 2025 },
  { id: 6, categoryId: 10, limitAmount: 4000, month: 8, year: 2025 },
  { id: 7, categoryId: 11, limitAmount: 5000, month: 8, year: 2025 },
  { id: 8, categoryId: 12, limitAmount: 25000, month: 8, year: 2025 },
];

export const USER = {
  id: 1,
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  currency: '₹',
};
