import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-white flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-2">404 - Page Not Found</h2>
      <p className="text-gray-400 text-sm mb-4">The requested route does not exist in KiranaFlow.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white transition shadow-lg shadow-blue-600/30"
      >
        Return to Control Tower
      </Link>
    </div>
  );
}
