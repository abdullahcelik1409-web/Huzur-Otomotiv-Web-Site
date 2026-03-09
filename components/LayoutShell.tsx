'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')

    if (isAdmin) {
        return <>{children}</>
    }

    return (
        <>
            <ScrollReveal />
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    )
}
