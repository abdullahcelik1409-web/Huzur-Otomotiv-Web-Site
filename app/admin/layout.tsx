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
        <div className="admin-layout min-h-screen bg-black text-white selection:bg-neon selection:text-black flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)}>
                    <aside className="h-full w-72 bg-tertiary p-6 shadow-2xl border-r border-white/5 flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-neon rounded-lg flex items-center justify-center text-black">
                                    <span className="material-symbols-outlined font-bold">directions_car</span>
                                </div>
                                <h1 className="text-xl font-bold tracking-tight">Huzur <span className="text-neon">Oto</span></h1>
                            </div>
                            <button className="p-2 text-secondary hover:text-neon transition-colors" onClick={() => setSidebarOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <nav className="flex-1 space-y-2">
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
                        </nav>
                    </aside>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-tertiary border-r border-white/5 h-screen sticky top-0 p-6 flex-shrink-0">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="bg-neon p-2 rounded-lg text-black">
                        <span className="material-symbols-outlined font-bold">directions_car</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">Huzur <span className="text-neon">Oto</span></h1>
                </div>
                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === item.href ? 'bg-neon/10 text-neon font-bold' : 'text-secondary hover:bg-white/5 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined">{item.icon === '📊' ? 'dashboard' : 'add_circle'}</span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                    <div className="pt-6 mt-6 border-t border-white/5">
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all font-medium text-left">
                            <span className="material-symbols-outlined">logout</span>
                            <span>Çıkış Yap</span>
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                {/* Top Nav (Mobile/Desktop Header) */}
                <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button className="p-2 lg:hidden text-secondary hover:text-white" onClick={() => setSidebarOpen(true)}>
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-lg font-bold text-white hidden lg:block">Yönetim Paneli</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Admin</span>
                            <span className="text-[10px] text-neon">huzuroto.com</span>
                        </div>
                        <div className="size-9 rounded-full bg-neon/20 flex items-center justify-center text-neon font-bold border border-neon/20 overflow-hidden">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>

                {/* Bottom Navigation (Mobile Only) */}
                <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-tertiary/95 backdrop-blur-xl border-t border-white/5 px-2 pb-6 pt-2 z-40">
                    <div className="flex justify-around items-center max-w-lg mx-auto">
                        <Link href="/admin" className={`flex flex-col items-center gap-1 ${pathname === '/admin' ? 'text-neon' : 'text-secondary'}`}>
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-[10px] font-bold">Panel</span>
                        </Link>
                        <Link href="/admin/ilan-ekle" className={`flex flex-col items-center gap-1 ${pathname === '/admin/ilan-ekle' ? 'text-neon' : 'text-secondary'}`}>
                            <span className="material-symbols-outlined">add_circle</span>
                            <span className="text-[10px] font-medium">Yeni İlan</span>
                        </Link>
                        <div className="-mt-8">
                            <button onClick={() => router.push('/admin/ilan-ekle')} className="size-14 bg-neon text-black rounded-full flex items-center justify-center shadow-lg shadow-neon/40 ring-4 ring-black active:scale-90 transition-transform">
                                <span className="material-symbols-outlined text-3xl font-bold">add</span>
                            </button>
                        </div>
                        <button className="flex flex-col items-center gap-1 text-secondary opacity-50 cursor-not-allowed">
                            <span className="material-symbols-outlined">analytics</span>
                            <span className="text-[10px] font-medium">Raporlar</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 text-secondary opacity-50 cursor-not-allowed">
                            <span className="material-symbols-outlined">settings</span>
                            <span className="text-[10px] font-medium">Ayarlar</span>
                        </button>
                    </div>
                </nav>
            </div>
        </div>
    )
}
