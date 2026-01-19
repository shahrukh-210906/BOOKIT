import React from 'react';
import { X, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, message, type = 'info', children, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <div className="bg-green-100 p-2 rounded-full"><CheckCircle className="w-6 h-6 text-green-600" /></div>;
      case 'danger': return <div className="bg-red-100 p-2 rounded-full"><AlertCircle className="w-6 h-6 text-red-600" /></div>;
      default: return <div className="bg-indigo-100 p-2 rounded-full"><HelpCircle className="w-6 h-6 text-indigo-600" /></div>;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {getIcon()}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800">{title}</h3>
              {message && <p className="text-slate-500 mt-1 text-sm">{message}</p>}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Custom Content (Inputs etc) */}
          {children && <div className="mt-4">{children}</div>}

          {/* Footer Actions */}
          <div className="mt-8 flex justify-end gap-3">
            {onClose && (
              <button 
                onClick={onClose} 
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {cancelText}
              </button>
            )}
            {onConfirm && (
              <button 
                onClick={onConfirm} 
                className={`px-6 py-2 rounded-xl text-sm font-semibold text-white shadow-md transition-all ${
                  type === 'danger' 
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;