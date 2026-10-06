'use client';

import React from 'react';

export function MetricSkeleton() {
  return (
    <div className="p-4 rounded-xl bg-[#111827] border border-gray-800 animate-pulse">
      <div className="h-3 w-16 bg-gray-800 rounded mb-2" />
      <div className="h-7 w-24 bg-gray-700 rounded mb-2" />
      <div className="h-2.5 w-20 bg-gray-800 rounded" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden p-4 space-y-3 animate-pulse">
      <div className="h-8 bg-gray-800/80 rounded" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="h-4 w-24 bg-gray-800 rounded" />
          <div className="h-4 w-36 bg-gray-850 rounded flex-1" />
          <div className="h-4 w-20 bg-gray-800 rounded" />
          <div className="h-4 w-16 bg-gray-800 rounded" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-[#111827] border border-gray-800 animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-4 w-32 bg-gray-800 rounded" />
        <div className="h-4 w-12 bg-gray-800 rounded" />
      </div>
      <div className="h-10 bg-gray-850 rounded" />
      <div className="h-3 w-48 bg-gray-800 rounded" />
    </div>
  );
}
