import '../styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Tetris Game',
  description: 'A Tetris game built with Next.js and TypeScript',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
