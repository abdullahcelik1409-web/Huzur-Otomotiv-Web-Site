'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import './admin.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    const isLoginPage = pathname === '/admin/login'

    useEffect(() => {
        if (isLoginPage) {
            setAuthenticated(true) // Don't block login page
            return
        }

        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/admin/login')
                setAuthenticated(false)
            } else {
                setAuthenticated(true)
            }
        }

        checkAuth()
    }, [pathname, isLoginPage, router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
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
        <div className="admin-layout min-h-screen bg-black text-white flex flex-col lg:flex-row">
            {/* Mobile Header & Hamburger */}
            <header className="lg:hidden flex items-center justify-between p-4 bg-tertiary border-b border-white/5 sticky top-0 z-[110]">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-neon rounded flex items-center justify-center text-black">
                        <span className="material-symbols-outlined text-xl font-bold">directions_car</span>
                    </div>
                    <span className="font-bold">Huzur <span className="text-neon">Oto</span></span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 text-secondary hover:text-white"
                >
                    <span className="material-symbols-outlined">{sidebarOpen ? 'close' : 'menu'}</span>
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <aside
                        className="h-full w-72 bg-tertiary p-6 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <nav className="flex-1 space-y-2 mt-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 p-3 rounded-xl transition-all ${pathname === item.href ? 'bg-neon/10 text-neon font-bold' : 'text-secondary hover:bg-white/5 hover:text-white'}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="material-symbols-outlined">{item.icon === '📊' ? 'dashboard' : 'add_circle'}</span>
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 p-3 rounded-xl text-red-500/70 hover:bg-red-500/10 transition-all text-left"
                            >
                                <span className="material-symbols-outlined">logout</span>
                                <span>Çıkış Yap</span>
                            </button>
                        </nav>
                    </aside>
                </div>
            )}

            {/* Desktop Sidebar (Fixed) */}
            <aside className="hidden lg:flex flex-col w-72 bg-tertiary border-r border-white/5 h-screen sticky top-0 p-6 flex-shrink-0">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="bg-neon p-2 rounded-lg text-black">
                        <span className="material-symbols-outlined font-bold">directions_car</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">Huzur <span className="text-neon">Oto</span></h1>
                </div>
                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname === item.href ? 'bg-neon/10 text-neon font-bold' : 'text-secondary hover:bg-white/5 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined">{item.icon === '📊' ? 'dashboard' : 'add_circle'}</span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>
                <div className="pt-6 mt-6 border-t border-white/5">
                    <button onClick={handleLogout} className="btn-base btn-ghost w-full !justify-start !text-red-500/80 hover:!bg-red-500/10">
                        <span className="material-symbols-outlined">logout</span>
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 flex flex-col">
                {/* Top Desktop Header */}
                <header className="hidden lg:flex h-16 items-center justify-between px-8 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40">
                    <h2 className="section-title">Yönetim Paneli</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-secondary">Yönetici</p>
                            <p className="text-[11px] text-neon">huzuroto.com</p>
                        </div>
                        <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-neon border border-white/10">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                    </div>
                </header>

                {/* Content Container (12-col Grid) */}
                <div className="p-4 lg:p-8 max-w-[1248px] w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
