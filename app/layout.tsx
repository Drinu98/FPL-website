import './globals.css'
import 'bootstrap/dist/css/bootstrap.css'

import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--roboto-font'
 })

export const metadata = {
  title: 'FPL Focal',
  description: 'Website for FPL Focal',
  keywords: ['FPL', 'Fantasy Premier League', 'fantasy', 'premier league', 'bonus points', 'transfers'],
  publisher: 'Andre Galea',
  icons: {
    icon: '/images/logo.png',
  } 
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  )
}
