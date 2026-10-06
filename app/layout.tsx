import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KiranaFlow — Intelligent Logistics Platform',
  description: 'B2B Distribution and Logistics Coordination Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
