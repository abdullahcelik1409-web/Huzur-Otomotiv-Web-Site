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
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 bg-black border-b border-white/5 sticky top-0 z-[110]">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-neon rounded-md flex items-center justify-center text-black">
                        <span className="material-symbols-outlined text-lg font-black">directions_car</span>
                    </div>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="size-10 flex items-center justify-center text-secondary hover:text-neon transition-colors"
                >
                    <span className="material-symbols-outlined">{sidebarOpen ? 'close' : 'menu'}</span>
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <aside
                        className="h-full w-72 bg-black border-r border-white/5 p-8 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-4 mb-10 px-2">
                            <div className="size-10 bg-neon rounded-xl flex items-center justify-center text-black">
                                <span className="material-symbols-outlined text-2xl font-black">directions_car</span>
                            </div>
                            <span className="font-black text-xl tracking-tighter italic">HUZUR <span className="text-neon">OTO</span></span>
                        </div>
                        <nav className="flex-1 space-y-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${pathname === item.href ? 'bg-neon text-black font-bold' : 'text-secondary hover:text-white'}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="material-symbols-outlined text-xl">{item.icon === '📊' ? 'dashboard' : 'add_circle'}</span>
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 p-4 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold mt-auto"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <span>Çıkış Yap</span>
                        </button>
                    </aside>
                </div>
            )}

            {/* Desktop Sidebar (Clean & Solid) */}
            <aside className="hidden lg:flex flex-col w-64 bg-black border-r border-white/5 h-screen sticky top-0 px-6 py-10 flex-shrink-0 z-50">
                <div className="flex items-center gap-4 mb-12 px-2">
                    <div className="size-10 bg-neon rounded-xl flex items-center justify-center text-black shadow-lg shadow-neon/20">
                        <span className="material-symbols-outlined text-2xl font-black">directions_car</span>
                    </div>
                    <h1 className="text-xl font-black tracking-tighter italic text-white uppercase">Huzur <span className="text-neon">Oto</span></h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${pathname === item.href ? 'bg-neon text-black font-black' : 'text-secondary hover:bg-white/5 hover:text-neon'}`}
                        >
                            <span className="material-symbols-outlined">{item.icon === '📊' ? 'dashboard' : 'add_circle'}</span>
                            <span className="font-bold text-sm uppercase tracking-wide">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/80 hover:bg-red-500/10 transition-all w-full font-bold">
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm uppercase tracking-wide">Güvenli Çıkış</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 flex flex-col bg-black">
                {/* Simplified Desktop Header */}
                <header className="hidden lg:flex h-20 items-center justify-between px-10 border-b border-white/5 sticky top-0 z-40 bg-black/80 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black uppercase tracking-widest text-secondary">Yönetim Paneli</span>
                        <span className="size-1 bg-neon/50 rounded-full mx-2"></span>
                        <span className="text-xs text-neon/80 font-bold uppercase tracking-widest">v2.0</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="h-8 w-px bg-white/5 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-60">Sistem Girişi</p>
                                <p className="text-xs text-white font-bold">huzuroto.com</p>
                            </div>
                            <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neon">
                                <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <div className="p-6 lg:p-10 max-w-[1400px] w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
