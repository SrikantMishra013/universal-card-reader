import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

// Define types for toast messages
interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Global event emitter for toasts
// This allows the toastService to communicate with the Toast component
type ToastListener = (message: Omit<ToastMessage, 'id'>) => void;
const listeners: ToastListener[] = [];

// Function to trigger a new toast message
export const showToast = (message: Omit<ToastMessage, 'id'>) => {
  listeners.forEach(listener => listener(message));
};

// Individual Toast Item component
interface ToastItemProps {
  toast: ToastMessage;
  removeToast: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, removeToast }) => {
  const { id, message, type } = toast;

  // Determine background color based on toast type
  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  }[type];

  // Determine icon based on toast type
  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  }[type];

  // Auto-dismiss the toast after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 5000);

    return () => clearTimeout(timer); // Cleanup timer on unmount or if toast is manually dismissed
  }, [id, removeToast]);

  return (
    <div
      className={`${bgColor} text-white p-4 rounded-lg shadow-xl flex items-center gap-4 transition-all duration-300 transform translate-x-0 opacity-100`}
      role="alert"
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-bold capitalize">{type}</p>
        <p className="text-sm">{message}</p>
      </div>
      <button onClick={() => removeToast(id)} className="p-1 rounded-full hover:bg-opacity-80 transition-colors">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

// Main Toast Container component
const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Callback to remove a toast from the state
  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Effect to subscribe to new toast events
  useEffect(() => {
    const handleShowToast = (message: Omit<ToastMessage, 'id'>) => {
      const id = Date.now().toString(); // Generate a unique ID for each toast
      setToasts(prevToasts => [...prevToasts, { ...message, id }]);
    };

    // Add the listener
    listeners.push(handleShowToast);

    // Cleanup: remove the listener when the component unmounts
    return () => {
      const index = listeners.indexOf(handleShowToast);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;