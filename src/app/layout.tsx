import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Mam Center - Equestrian Club',
  description: 'Premium equestrian club in Erbil, Kurdistan, Iraq. Horse riding academy, safari experiences, and Baran Coffee lifestyle.',
  keywords: ['equestrian', 'horse riding', 'erbil', 'kurdistan', 'iraq', 'mam center', 'safari', 'academy'],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  openGraph: {
    title: 'Mam Center - Equestrian Club',
    description: 'Premium equestrian club in Erbil, Kurdistan, Iraq',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mam Center',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ku" dir="rtl" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
