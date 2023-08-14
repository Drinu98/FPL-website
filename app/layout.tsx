import './globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Analytics } from '@vercel/analytics/react';

import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--roboto-font'
 })

export const metadata = {
  title: 'FPL Focal',
  description: 'A website for FPL Focal that displays important information on Fantasy Premier League',
  keywords: ['FPL', 'Fantasy Premier League', 'fantasy', 'premier league', 'bonus points', 'transfers', 'kits', 'fixtures', 'deadline', 'focal', 'fplfocal', 'youtube'],
  publisher: 'Andre Galea'
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
