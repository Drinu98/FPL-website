import './globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Analytics } from '@vercel/analytics/react';
import GoogleAnalytics from './components/GoogleAnalytics';
import Footer from './components/footer'

import { Roboto } from 'next/font/google'
import { Suspense } from 'react';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--roboto-font'
 })

export const metadata = {
  title: 'FPL Focal',
  description: 'Your FPL dashboard with everything you need for Fantasy Premier League. Bonus Points, Top 10K stats, Effective Ownership, Price Changes, Top Transfers, Expected Data and more.',
  keywords: ['FPL', 'Fantasy Premier League', 'fantasy', 'premier league', 'bonus points', 'transfers', 'kits', 'fixtures', 'deadline', 'focal', 'fplfocal', 'youtube'],
  publisher: 'Andre Galea',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Suspense fallback={<></>}>
        <GoogleAnalytics GA_MEASUREMENT_ID='G-Z801EHYGJ6'/>
      </Suspense>
        <body className={roboto.className} data-theme="light" id='light'>
          {children}
          <Analytics />
          <Footer />
        </body>
    </html>
  )
}
