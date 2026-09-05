import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let borderAccent = 'border-[#00687a]';
        let iconColor = 'text-[#00687a]';
        let Icon = Info;

        if (toast.type === 'success') {
          borderAccent = 'border-[#10b981]';
          iconColor = 'text-[#10b981]';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          borderAccent = 'border-[#ba1a1a]';
          iconColor = 'text-[#ba1a1a]';
          Icon = AlertCircle;
        } else if (toast.type === 'warning') {
          borderAccent = 'border-[#f59e0b]';
          iconColor = 'text-[#f59e0b]';
          Icon = AlertTriangle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 bg-[#ffffff] text-[#0b1c30] rounded-lg shadow-xl border-l-4 ${borderAccent} flex items-center gap-3 transition-all transform duration-300 text-[14px] border border-[#eff4ff]`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
            <div className="flex-1 font-medium leading-tight">{toast.message}</div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#737686] hover:text-[#0b1c30] transition-colors p-1"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
