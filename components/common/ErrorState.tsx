'use client';

import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div className="p-6 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-400 shrink-0">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-white text-sm">{title}</h4>
          <p className="text-gray-300 mt-1 leading-relaxed">{description}</p>
          <div className="text-[11px] text-gray-500 mt-1 font-mono">
            Your live operational data remains protected and unmodified.
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-semibold text-xs transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Operation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
