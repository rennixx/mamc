import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Mam Center - Equestrian Club',
  description: 'Premium equestrian club in Sulaymaniyah, Iraq. Horse riding academy, safari experiences, and Baran Coffee lifestyle.',
  keywords: ['equestrian', 'horse riding', 'sulaymaniyah', 'iraq', 'mam center', 'safari', 'academy'],
  openGraph: {
    title: 'Mam Center - Equestrian Club',
    description: 'Premium equestrian club in Sulaymaniyah, Iraq',
    type: 'website',
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
