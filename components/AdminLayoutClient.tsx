'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    const isLoginPage = pathname === '/admin/login'

    if (isLoginPage) return <>{children}</>

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
        { name: 'İlan Ekle', href: '/admin/ilan-ekle', icon: 'add_circle' },
    ]

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    return (
        <div className="admin-layout">
            {/* Desktop Sidebar */}
            <aside className="sidebar-container">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            directions_car
                        </span>
                    </div>
                    <div className="sidebar-logo-text">
                        HUZUR <span className="neon">OTO</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                            logout
                        </span>
                        <span>Çıkış</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Top Bar */}
            <div className="mobile-top-bar">
                <div className="mobile-logo">
                    <div style={{
                        width: '28px',
                        height: '28px',
                        background: 'var(--accent-neon)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'black',
                        fontSize: '16px',
                        fontWeight: 900
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                            directions_car
                        </span>
                    </div>
                    <span>HUZUR <span style={{ color: 'var(--accent-neon)' }}>OTO</span></span>
                </div>
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle Menu"
                >
                    <span className="material-symbols-outlined">
                        {sidebarOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="sidebar-overlay active">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-neon)',
                            fontSize: '28px',
                            cursor: 'pointer'
                        }}
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                    <button
                        onClick={() => {
                            handleLogout()
                            setSidebarOpen(false)
                        }}
                        className="logout-btn"
                        style={{ marginTop: '32px' }}
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span>Güvenli Çıkış</span>
                    </button>
                </div>
            )}

            {/* Main Content */}
            <main>
                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    )
}
