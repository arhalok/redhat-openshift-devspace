'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  period?: string;
  icon?: LucideIcon;
  badge?: string;
  variant?: 'neutral' | 'blue' | 'green' | 'amber' | 'red' | 'purple';
  onClick?: () => void;
  subtext?: string;
}

export function MetricCard({
  title,
  value,
  delta,
  deltaPositive = true,
  period = 'Today',
  icon: Icon,
  badge,
  variant = 'neutral',
  onClick,
  subtext,
}: MetricCardProps) {
  const borderColors = {
    neutral: 'border-gray-800 hover:border-gray-700',
    blue: 'border-blue-900/50 hover:border-blue-700/60',
    green: 'border-emerald-900/50 hover:border-emerald-700/60',
    amber: 'border-amber-900/50 hover:border-amber-700/60',
    red: 'border-red-950/60 hover:border-red-800/60',
    purple: 'border-purple-900/50 hover:border-purple-700/60',
  };

  const accentStyles = {
    neutral: 'text-gray-100',
    blue: 'text-blue-400',
    green: 'text-emerald-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-[#111827] border p-4 rounded-lg transition ${borderColors[variant]} ${
        onClick ? 'cursor-pointer hover:bg-[#162033]' : ''
      }`}
    >
      <div className="flex items-center justify-between text-xs font-semibold uppercase text-gray-400">
        <span className="truncate">{title}</span>
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        {badge && (
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-gray-800 text-gray-300">
            {badge}
          </span>
        )}
      </div>

      <div className={`text-2xl font-bold mt-1.5 font-mono ${accentStyles[variant]}`}>
        {value}
      </div>

      <div className="flex items-center justify-between mt-2 text-xs">
        {delta && (
          <span
            className={`font-semibold flex items-center gap-0.5 ${
              deltaPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {delta.startsWith('↑') || delta.startsWith('+') ? '↑' : '↓'} {delta.replace(/^[↑↓+-]\s*/, '')}
          </span>
        )}
        {period && <span className="text-gray-500 text-[11px]">{period}</span>}
      </div>

      {subtext && <div className="text-[11px] text-gray-400 mt-1 truncate">{subtext}</div>}
    </div>
  );
}
