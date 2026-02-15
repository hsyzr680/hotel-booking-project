import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SessionProvider from '@/components/providers/SessionProvider'

const cairo = Cairo({ subsets: ['arabic', 'latin'] })

export const metadata: Metadata = {
  title: 'فندق القدوة - للحجوزات الفندقية الاحترافية',
  description: 'أفضل منصة لحجز الفنادق والغرف أونلاين في العراق.',
  keywords: 'فندق، حجز فنادق، فندق القدوة، العراق، فنادق بغداد',
  openGraph: {
    title: 'فندق القدوة - للحجوزات الفندقية الاحترافية',
    description: 'أفضل منصة لحجز الفنادق والغرف أونلاين في العراق.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <SessionProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
