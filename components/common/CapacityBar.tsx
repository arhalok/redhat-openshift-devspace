'use client';

import React from 'react';

interface CapacityBarProps {
  percentage: number;
  currentKg?: number;
  totalKg?: number;
  showLabels?: boolean;
}

export function CapacityBar({
  percentage,
  currentKg,
  totalKg,
  showLabels = true,
}: CapacityBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  let barColor = 'bg-blue-500';
  if (clamped > 85) {
    barColor = 'bg-red-500';
  } else if (clamped > 70) {
    barColor = 'bg-amber-500';
  } else {
    barColor = 'bg-emerald-500';
  }

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-gray-400">Capacity Utilization</span>
          <span className="font-mono font-semibold text-gray-200">
            {clamped}% {currentKg && totalKg ? `(${currentKg} / ${totalKg} kg)` : ''}
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
        <div
          className={`h-full transition-all duration-500 rounded-full ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
