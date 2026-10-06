'use client';

import React from 'react';
import { LogisticsProvider } from '../lib/logistics-state';
import { AppShell } from '../components/shell/AppShell';

export default function HomePage() {
  return (
    <LogisticsProvider>
      <AppShell />
    </LogisticsProvider>
  );
}
