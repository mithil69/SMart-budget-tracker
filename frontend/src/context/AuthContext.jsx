import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('budget_token') !== null;
  });
  const [authUser, setAuthUser] = useState(() => {
    const u = localStorage.getItem('budget_user');
    return u ? JSON.parse(u) : null;
  });

  const login = (email, password) => {
    // In production: call POST /api/auth/login
    if (email && password.length >= 6) {
      const mockUser = {
        id: 1,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email,
        token: 'mock-jwt-token-' + Date.now(),
      };
      localStorage.setItem('budget_token', mockUser.token);
      localStorage.setItem('budget_user', JSON.stringify(mockUser));
      setAuthUser(mockUser);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Password must be at least 6 characters.' };
  };

  const register = (name, email, password) => {
    // In production: call POST /api/auth/register
    if (name && email && password.length >= 6) {
      const mockUser = { id: 1, name, email, token: 'mock-jwt-token-' + Date.now() };
      localStorage.setItem('budget_token', mockUser.token);
      localStorage.setItem('budget_user', JSON.stringify(mockUser));
      setAuthUser(mockUser);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Please fill all fields. Password must be at least 6 characters.' };
  };

  const logout = () => {
    localStorage.removeItem('budget_token');
    localStorage.removeItem('budget_user');
    setAuthUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
