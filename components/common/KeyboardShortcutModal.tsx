'use client';

import React from 'react';
import { useLogistics } from '../../lib/logistics-state';
import { Command, CornerDownLeft, Search, X } from 'lucide-react';

export function KeyboardShortcutModal() {
  const { keyboardHelpOpen, setKeyboardHelpOpen } = useLogistics();

  if (!keyboardHelpOpen) return null;

  const shortcuts = [
    { key: '⌘ / Ctrl + K', description: 'Open global Command Palette & instant entity search' },
    { key: '/', description: 'Quick-focus search input / Command Palette' },
    { key: 'Esc', description: 'Close any active drawer, modal, or command palette' },
    { key: 'Enter', description: 'Confirm and execute selected highlighted action' },
    { key: '↑ / ↓', description: 'Navigate through lists, search hits, and route stops' },
    { key: '?', description: 'Toggle this keyboard shortcut reference sheet' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setKeyboardHelpOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-[#0f172a] border border-gray-700 rounded-xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Operational Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={() => setKeyboardHelpOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Power-user navigation accelerators designed for high-throughput logistics control tower operations.
        </p>

        <div className="divide-y divide-gray-800/80 mt-4">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-gray-300">{sc.description}</span>
              <kbd className="px-2 py-1 rounded bg-gray-900 border border-gray-700 font-mono text-[11px] font-bold text-blue-300 shadow-inner">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <span>Non-conflicting browser navigation standards</span>
          <button
            onClick={() => setKeyboardHelpOpen(false)}
            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
