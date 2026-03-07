import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import './utils.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Huzur Otomotiv | Premium Ticari Araç Çözümleri',
  description: 'İstanbul Maltepe\'de güvenilir ve premium ticari araç satıcısı. En iyi kamyon, tır ve hafif ticari araç ilanları.',
  keywords: 'Huzur Otomotiv, ticari araç, kamyon, tır, İstanbul ticari araç, Maltepe otomotiv',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <ScrollReveal />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
