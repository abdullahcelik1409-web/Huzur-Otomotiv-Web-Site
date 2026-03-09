'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import './admin.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    const isLoginPage = pathname === '/admin/login'

    useEffect(() => {
        if (isLoginPage) {
            setAuthenticated(false)
            return
        }

        fetch('/api/auth/check')
            .then(res => {
                if (!res.ok) {
                    router.push('/admin/login')
                    return
                }
                setAuthenticated(true)
            })
            .catch(() => {
                router.push('/admin/login')
            })
    }, [pathname, isLoginPage, router])

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/admin/login')
    }

    // Login page - no sidebar
    if (isLoginPage) {
        return <>{children}</>
    }

    // Loading state
    if (authenticated === null) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                Yükleniyor...
            </div>
        )
    }

    if (!authenticated) {
        return null
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'İlan Ekle', href: '/admin/ilan-ekle', icon: '➕' },
    ]

    return (
        <div className="admin-layout">
            <button
                className="admin-mobile-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                ☰
            </button>

            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-logo">
                    <h2>HUZUR <span className="text-neon">OTOMOTİV</span></h2>
                    <span className="admin-badge">Admin Panel</span>
                </div>

                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        🚪 Çıkış Yap
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                {children}
            </main>
        </div>
    )
}
