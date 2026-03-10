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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Header */}
            <div className="section-header">
                <h1 className="section-title">
                    Genel <span className="neon">Bakış</span>
                </h1>
                <p className="section-subtitle">Mağazanızın güncel durumunu buradan yönetin.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid-4">
                {/* Total Vehicles Card */}
                <div className="admin-card stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Toplam İlan</span>
                        <div className="stat-icon neon">
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                    </div>
                    <div className="stat-value">{totalVehicles}</div>
                    <div className="stat-footer">İşlem Yapılabilir</div>
                </div>

                {/* Active Vehicles Card */}
                <div className="admin-card stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Aktif İlanlar</span>
                        <div className="stat-icon success">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    </div>
                    <div className="stat-value">{activeVehicles}</div>
                    <div className="stat-footer">Yayında</div>
                </div>

                {/* Featured Vehicles Card */}
                <div className="admin-card stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Öne Çıkanlar</span>
                        <div className="stat-icon warning">
                            <span className="material-symbols-outlined">star</span>
                        </div>
                    </div>
                    <div className="stat-value">{featuredVehicles}</div>
                    <div className="stat-footer">Vitrin Hizmeti</div>
                </div>

                {/* Passive Records Card */}
                <div className="admin-card stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Pasif Kayıtlar</span>
                        <div className="stat-icon danger">
                            <span className="material-symbols-outlined">pause_circle</span>
                        </div>
                    </div>
                    <div className="stat-value">{passiveVehicles}</div>
                    <div className="stat-footer">Durdurulmuş</div>
                </div>
            </div>

            {/* Vehicles List */}
            <div className="space-y-4">
                <div className="card-header">
                    <h2 className="card-header-title">Son Eklenen İlanlar ({vehicles.length})</h2>
                    <Link href="/admin/ilan-ekle" className="btn btn-primary btn-small">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                        Yeni İlan
                    </Link>
                </div>

                {loading ? (
                    <div className="admin-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
                        <div className="spinner" style={{ margin: '0 auto', marginBottom: '16px' }}></div>
                        <p className="stat-label">Veriler Çekiliyor...</p>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="admin-card empty-state">
                        <div className="empty-state-icon">
                            <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
                                inventory_2
                            </span>
                        </div>
                        <h3 className="empty-state-title">Henüz İlan Eklenmemiş</h3>
                        <p className="empty-state-desc">Araç detaylarını girerek ilk ilanı yayınlayın.</p>
                        <Link href="/admin/ilan-ekle" className="btn btn-primary btn-small" style={{ marginTop: '24px', width: 'auto' }}>
                            İlk İlanı Yayınla
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {vehicles.map((v) => (
                            <div key={v.id} className="admin-card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                    <img
                                        src={v.images[0] || '/placeholder.png'}
                                        alt={v.title}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '8px',
                                            objectFit: 'cover',
                                            border: '1px solid var(--border-color)',
                                            flexShrink: 0
                                        }}
                                    />
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                                            {v.title}
                                        </h4>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--secondary-bg)', padding: '4px 8px', borderRadius: '4px' }}>
                                                {v.brand} {v.model}
                                            </span>
                                            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-neon)', background: 'var(--accent-neon-muted)', padding: '4px 8px', borderRadius: '4px' }}>
                                                {v.price.toLocaleString()} ₺
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <button
                                        className="btn btn-secondary btn-small"
                                        onClick={() => router.push(`/ilan/demo?id=${v.id}`)}
                                        title="Düzenle"
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                                    </button>
                                    <button
                                        className="btn btn-danger btn-small"
                                        onClick={() => handleDelete(v.id, v.title)}
                                        disabled={deleting === v.id}
                                        title="Sil"
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                                            {deleting === v.id ? 'sync' : 'delete'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
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
