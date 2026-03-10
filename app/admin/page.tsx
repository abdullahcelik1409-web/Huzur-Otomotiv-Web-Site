'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Vehicle {
    id: number
    slug: string
    title: string
    brand: string
    model: string
    year: number
    price: number
    km: number
    images: string[]
    featured: boolean
    status: string
}

export default function AdminDashboard() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<number | null>(null)
    const router = useRouter()

    const fetchVehicles = async () => {
        try {
            const res = await fetch('/api/vehicles')
            const data = await res.json()
            setVehicles(data.cars || [])
        } catch (err) {
            console.error('Error fetching vehicles:', err)
        } finally {
            setLoading(false)
        }
    }

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) router.push('/admin/login')
    }

    useEffect(() => {
        checkAuth()
        fetchVehicles()
    }, [])

    const handleDelete = async (id: number, title: string) => {
        if (!confirm(`"${title}" ilanını silmek istediğinize emin misiniz?`)) return

        setDeleting(id)
        try {
            const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
            if (res.ok) setVehicles(prev => prev.filter(v => v.id !== id))
        } catch (err) {
            console.error('Error deleting vehicle:', err)
        } finally {
            setDeleting(null)
        }
    }

    // Stats
    const totalVehicles = vehicles.length
    const activeVehicles = vehicles.filter(v => v.status === 'active' || !v.status).length
    const featuredVehicles = vehicles.filter(v => v.featured).length
    const passiveVehicles = vehicles.filter(v => v.status === 'passive').length

    return (
        <div className="space-y-8 lg:space-y-12">
            {/* Header Actions */}
            <div className="admin-header-actions">
                <div className="flex-1">
                    <h1 className="text-3xl lg:text-4xl font-black italic tracking-tighter uppercase">Genel <span className="text-neon">Bakış</span></h1>
                    <p className="stat-label mt-2 lg:mt-1">Mağazanızın güncel durumunu buradan yönetin.</p>
                </div>
                <Link href="/admin/ilan-ekle" className="btn-premium shrink-0">
                    <span className="material-symbols-outlined font-black">add</span>
                    <span className="hidden sm:inline">Yeni İlan Yayınla</span>
                    <span className="sm:hidden">Yeni İlan</span>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="admin-card">
                    <div className="flex justify-between items-start">
                        <span className="stat-label">Toplam İlan</span>
                        <div className="size-10 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center text-neon">
                            <span className="material-symbols-outlined text-lg">analytics</span>
                        </div>
                    </div>
                    <div className="stat-value">{totalVehicles}</div>
                    <div className="text-[10px] text-neon/50 font-black mt-3 uppercase tracking-tighter">İşlem Yapılabilir</div>
                </div>

                <div className="admin-card">
                    <div className="flex justify-between items-start">
                        <span className="stat-label">Aktif İlanlar</span>
                        <div className="size-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                        </div>
                    </div>
                    <div className="stat-value">{activeVehicles}</div>
                    <div className="text-[10px] text-green-500/50 font-black mt-3 uppercase tracking-tighter">Yayında</div>
                </div>

                <div className="admin-card">
                    <div className="flex justify-between items-start">
                        <span className="stat-label">Öne Çıkanlar</span>
                        <div className="size-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                            <span className="material-symbols-outlined text-lg">auto_awesome</span>
                        </div>
                    </div>
                    <div className="stat-value">{featuredVehicles}</div>
                    <div className="text-[10px] text-amber-500/50 font-black mt-3 uppercase tracking-tighter">Vitrin Hizmeti</div>
                </div>

                <div className="admin-card">
                    <div className="flex justify-between items-start">
                        <span className="stat-label">Pasif Kayıtlar</span>
                        <div className="size-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                            <span className="material-symbols-outlined text-lg">pause_circle</span>
                        </div>
                    </div>
                    <div className="stat-value">{passiveVehicles}</div>
                    <div className="text-[10px] text-red-500/50 font-black mt-3 uppercase tracking-tighter">Durdurulmuş</div>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Recent Items List */}
                <section className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <h2 className="text-xl font-black italic tracking-tighter uppercase">Son Eklenen İlanlar</h2>
                        <span className="text-[10px] font-black uppercase text-secondary bg-white/5 px-3 py-1 rounded-full">{vehicles.length} Kayıt</span>
                    </div>

                    {loading ? (
                        <div className="admin-card text-center py-16 lg:py-20 opacity-50">
                            <div className="spinner mx-auto mb-4"></div>
                            <p className="stat-label">Veriler Çekiliyor...</p>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="admin-card text-center py-16 lg:py-20 border-dashed">
                            <span className="material-symbols-outlined text-3xl lg:text-4xl text-secondary mb-4 opacity-20">inventory_2</span>
                            <p className="stat-label">Henüz hiçbir ilan eklenmemiş.</p>
                            <Link href="/admin/ilan-ekle" className="text-neon text-xs font-black mt-4 inline-block underline underline-offset-4">İlk İlanı Yayınla</Link>
                        </div>
                    ) : (
                        <div className="space-y-3 lg:space-y-4">
                            {vehicles.map((v) => (
                                <div key={v.id} className="admin-card !p-4 lg:!p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 group">
                                    <div className="flex items-center gap-4 lg:gap-6 flex-1">
                                        <div className="size-14 lg:size-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                                            <img src={v.images[0] || '/placeholder.png'} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-black text-base lg:text-lg tracking-tight uppercase group-hover:text-neon transition-colors truncate">{v.title}</h4>
                                            <div className="flex flex-wrap items-center gap-2 lg:gap-3 mt-1">
                                                <span className="text-[9px] lg:text-[10px] font-black text-secondary uppercase bg-white/5 px-2 py-0.5 rounded">{v.brand} {v.model}</span>
                                                <span className="text-[9px] lg:text-[10px] font-black text-neon/80 uppercase">{v.price.toLocaleString()} ₺</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button className="size-9 lg:size-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-neon hover:text-black transition-all">
                                            <span className="material-symbols-outlined text-base lg:text-lg">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(v.id, v.title)}
                                            disabled={deleting === v.id}
                                            className="size-9 lg:size-10 rounded-xl bg-white/5 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <span className="material-symbols-outlined text-base lg:text-lg">{deleting === v.id ? 'sync' : 'delete'}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Vertical Side Widgets */}
                <aside className="lg:col-span-4 space-y-6 lg:space-y-8">
                    {/* Activity Widget */}
                    <div className="admin-card">
                        <h3 className="stat-label mb-6 flex items-center gap-2">
                            <span className="size-2 bg-neon rounded-full animate-pulse"></span>
                            Son İşlemler
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="size-8 rounded-lg bg-neon/10 flex items-center justify-center text-neon shrink-0">
                                    <span className="material-symbols-outlined text-sm">history</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold">Veri senkronizasyonu tamamlandı.</p>
                                    <p className="text-[10px] text-secondary mt-1 uppercase">Az Önce</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-white shrink-0">
                                    <span className="material-symbols-outlined text-sm">login</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold">Yönetici girişi başarılı.</p>
                                    <p className="text-[10px] text-secondary mt-1 uppercase">1 Saat Önce</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="admin-card bg-neon/5 border-neon/10">
                        <h3 className="stat-label mb-4 lg:mb-5 text-neon">Hızlı Erişim</h3>
                        <div className="grid grid-cols-2 gap-2 lg:gap-3">
                            <Link href="/" className="p-3 lg:p-4 rounded-xl bg-black/50 border border-white/5 hover:border-neon transition-all text-center">
                                <span className="material-symbols-outlined text-lg lg:text-xl mb-1 lg:mb-2 block">visibility</span>
                                <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-secondary">Siteye Git</p>
                            </Link>
                            <Link href="/admin/ilan-ekle" className="p-3 lg:p-4 rounded-xl bg-black/50 border border-white/5 hover:border-neon transition-all text-center">
                                <span className="material-symbols-outlined text-lg lg:text-xl mb-1 lg:mb-2 block">add_task</span>
                                <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-secondary">Hızlı İlan</p>
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
