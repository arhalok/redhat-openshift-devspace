'use client';

import React from 'react';
import { useLogistics } from '../../lib/logistics-state';
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useLogistics();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
        };

        const borderColors = {
          success: 'border-emerald-800/80 bg-gray-900/95',
          info: 'border-blue-800/80 bg-gray-900/95',
          warning: 'border-amber-800/80 bg-gray-900/95',
          error: 'border-rose-800/80 bg-gray-900/95',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-xl text-sm ${borderColors[toast.type]} backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            {icons[toast.type]}
            <div className="flex-1">
              <div className="font-semibold text-white">{toast.title}</div>
              {toast.message && (
                <div className="text-xs text-gray-300 mt-0.5 leading-relaxed">{toast.message}</div>
              )}
              {toast.action && (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      toast.action?.onClick();
                      removeToast(toast.id);
                    }}
                    className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition shadow"
                  >
                    {toast.action.label}
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white p-0.5 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
