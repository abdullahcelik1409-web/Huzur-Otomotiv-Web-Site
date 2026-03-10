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
            setAuthenticated(true)
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

    if (isLoginPage) return <>{children}</>

    if (authenticated === null) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                Yükleniyor...
            </div>
        )
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
        { name: 'İlan Ekle', href: '/admin/ilan-ekle', icon: 'add_circle' },
    ]

    return (
        <div className="admin-layout">
            {/* Desktop Sidebar */}
            <aside className="sidebar-container">
                <div className="p-8 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-neon rounded-xl flex items-center justify-center text-black shadow-lg shadow-neon/20">
                            <span className="material-symbols-outlined text-2xl font-black">directions_car</span>
                        </div>
                        <span className="font-black text-xl tracking-tighter italic text-white leading-none">
                            HUZUR <span className="text-neon">OTO</span>
                        </span>
                    </div>
                </div>

                <nav className="flex-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-3 text-red-500/80 hover:text-red-500 transition-all font-bold uppercase text-xs tracking-widest">
                        <span className="material-symbols-outlined">logout</span>
                        <span>Güvenli Çıkış</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b border-white/5 flex items-center justify-between px-4 z-[110]">
                <div className="flex items-center gap-2">
                    <div className="size-8 bg-neon rounded-lg flex items-center justify-center text-black">
                        <span className="material-symbols-outlined text-lg font-black">directions_car</span>
                    </div>
                    <span className="font-black text-sm tracking-tighter italic">HUZUR <span className="text-neon">OTO</span></span>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-neon">
                    <span className="material-symbols-outlined">{sidebarOpen ? 'close' : 'menu'}</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 min-w-0 bg-black overflow-y-auto w-full">
                <header className="hidden lg:flex h-20 items-center justify-between px-8 lg:px-12 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Sistem Yönetimi</span>
                        <div className="h-4 w-px bg-white/10"></div>
                        <span className="text-xs font-bold text-neon uppercase">v2.0 Beta</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Yönetici</p>
                            <p className="text-xs text-white font-bold">huzuroto.com</p>
                        </div>
                        <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neon shadow-inner">
                            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8 xl:p-12 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Overlay Menu */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl lg:hidden flex flex-col p-12">
                    <button onClick={() => setSidebarOpen(false)} className="absolute top-8 right-8 text-neon">
                        <span className="material-symbols-outlined text-4xl">close</span>
                    </button>
                    <nav className="flex-1 flex flex-col justify-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-4xl font-black italic tracking-tighter text-white hover:text-neon transition-all"
                                onClick={() => setSidebarOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <button onClick={handleLogout} className="text-red-500 text-2xl font-black uppercase tracking-widest text-left mt-8">
                            Çıkış Yap
                        </button>
                    </nav>
                </div>
            )}
        </div>
    )
}
