'use client';

import React from 'react';

export type StatusBadgeVariant =
  | 'neutral'
  | 'blue'
  | 'green'
  | 'amber'
  | 'red'
  | 'purple';

interface StatusBadgeProps {
  label: string;
  variant?: StatusBadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function StatusBadge({
  label,
  variant = 'neutral',
  size = 'md',
  dot = true,
}: StatusBadgeProps) {
  const variantStyles = {
    neutral: 'bg-gray-800 text-gray-300 border-gray-700',
    blue: 'bg-blue-950/60 text-blue-400 border-blue-800/60',
    green: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
    amber: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
    red: 'bg-red-950/60 text-red-400 border-red-800/60',
    purple: 'bg-purple-950/60 text-purple-400 border-purple-800/60',
  };

  const dotColors = {
    neutral: 'bg-gray-400',
    blue: 'bg-blue-400',
    green: 'bg-emerald-400',
    amber: 'bg-amber-400',
    red: 'bg-red-400',
    purple: 'bg-purple-400',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      <span>{label}</span>
    </span>
  );
}

export function mapOrderStatusToVariant(status: string): StatusBadgeVariant {
  switch (status) {
    case 'DELIVERED':
      return 'green';
    case 'IN_TRANSIT':
    case 'OUT_FOR_DELIVERY':
      return 'blue';
    case 'PREPARING':
    case 'READY_FOR_DISPATCH':
    case 'CONFIRMED':
      return 'neutral';
    case 'PENDING':
    case 'DRAFT':
      return 'amber';
    case 'EXCEPTION':
    case 'CANCELLED':
      return 'red';
    default:
      return 'neutral';
  }
}
