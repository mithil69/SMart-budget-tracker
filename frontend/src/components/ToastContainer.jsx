import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.type === 'success'
            ? <CheckCircle size={16} />
            : <XCircle size={16} />
          }
          {toast.message}
        </div>
      ))}
    </div>
  );
}
