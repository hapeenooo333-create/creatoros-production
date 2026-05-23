import React from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from './types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2.5 max-w-sm w-full pointer-events-none" id="global-toast-container">
      {toasts.map((toast) => {
        const typeStyles = {
          success: 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-100/50 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-100',
          info: 'bg-blue-50 border-blue-200 text-blue-900 shadow-blue-100/50 dark:bg-zinc-900/95 dark:border-zinc-800 dark:text-zinc-100',
          warning: 'bg-amber-50 border-amber-200 text-amber-900 shadow-amber-100/50 dark:bg-amber-950/90 dark:border-amber-800 dark:text-amber-100',
          error: 'bg-red-50 border-red-200 text-red-950 shadow-red-100/50 dark:bg-red-950/90 dark:border-red-800 dark:text-red-100'
        };

        const Icon = {
          success: CheckCircle,
          info: Info,
          warning: AlertTriangle,
          error: AlertCircle
        }[toast.type];

        return (
          <div
            key={toast.id}
            id={`toast-message-item-${toast.id}`}
            className={`
              pointer-events-auto p-4 rounded-xl border flex items-start gap-3 shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-in
              ${typeStyles[toast.type]}
            `}
          >
            <Icon className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs font-semibold leading-relaxed font-sans">
              {toast.text}
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-[#a19c91] hover:text-[#1a1917] dark:hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
