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
        if (!session) {
            router.push('/admin/login')
        }
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
            if (res.ok) {
                setVehicles(prev => prev.filter(v => v.id !== id))
            }
        } catch (err) {
            console.error('Error deleting vehicle:', err)
        } finally {
            setDeleting(null)
        }
    }

    // Stats calculation
    const totalVehicles = vehicles.length
    const activeVehicles = vehicles.filter(v => v.status === 'active' || !v.status).length
    const featuredVehicles = vehicles.filter(v => v.featured).length
    const passiveVehicles = vehicles.filter(v => v.status === 'passive').length

    return (
        <div className="space-y-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="page-title !text-3xl tracking-tight">İstatistiki <span className="text-neon">Veriler</span></h1>
                    <p className="text-secondary text-sm mt-2 opacity-60">Mağazanızın güncel performans özetini görün.</p>
                </div>
                <Link href="/admin/ilan-ekle" className="btn-base btn-primary !h-12 !px-8 shadow-xl hover:scale-[1.02]">
                    <span className="material-symbols-outlined">add_circle</span>
                    Hemen İlan Ekle
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid-12">
                <div className="admin-card col-span-12 md:col-span-6 lg:col-span-3 flex flex-col gap-6 group">
                    <div className="flex items-center justify-between">
                        <div className="size-12 bg-neon/10 text-neon rounded-xl flex items-center justify-center border border-neon/20 group-hover:bg-neon group-hover:text-black transition-all duration-300">
                            <span className="material-symbols-outlined text-2xl font-black">analytics</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-40">Veri Analizi</span>
                    </div>
                    <div>
                        <p className="text-secondary text-xs font-black uppercase tracking-widest opacity-60 mb-1">Toplam İlan</p>
                        <h3 className="text-4xl font-black text-white">{totalVehicles}</h3>
                    </div>
                </div>

                <div className="admin-card col-span-12 md:col-span-6 lg:col-span-3 flex flex-col gap-6 group">
                    <div className="flex items-center justify-between">
                        <div className="size-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center border border-green-500/20 group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
                            <span className="material-symbols-outlined text-2xl font-black">check_circle</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-40">Canlı Yayında</span>
                    </div>
                    <div>
                        <p className="text-secondary text-xs font-black uppercase tracking-widest opacity-60 mb-1">Aktif İlanlar</p>
                        <h3 className="text-4xl font-black text-white">{activeVehicles}</h3>
                    </div>
                </div>

                <div className="admin-card col-span-12 md:col-span-6 lg:col-span-3 flex flex-col gap-6 group">
                    <div className="flex items-center justify-between">
                        <div className="size-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300">
                            <span className="material-symbols-outlined text-2xl font-black">auto_awesome</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-40">Vitrinde</span>
                    </div>
                    <div>
                        <p className="text-secondary text-xs font-black uppercase tracking-widest opacity-60 mb-1">Öne Çıkan</p>
                        <h3 className="text-4xl font-black text-white">{featuredVehicles}</h3>
                    </div>
                </div>

                <div className="admin-card col-span-12 md:col-span-6 lg:col-span-3 flex flex-col gap-6 group">
                    <div className="flex items-center justify-between">
                        <div className="size-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center border border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                            <span className="material-symbols-outlined text-2xl font-black">pause_circle</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-40">Durduruldu</span>
                    </div>
                    <div>
                        <p className="text-secondary text-xs font-black uppercase tracking-widest opacity-60 mb-1">Pasif Kayıtlar</p>
                        <h3 className="text-4xl font-black text-white">{passiveVehicles}</h3>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="section-title">Son Eklenen İlanlar</h2>
                    <span className="text-secondary text-xs">{vehicles.length} İlan</span>
                </div>

                {loading ? (
                    <div className="admin-card text-center py-12">
                        <div className="inline-block animate-spin size-6 border-2 border-neon border-t-transparent rounded-full mb-4"></div>
                        <p className="text-secondary">Veriler yükleniyor...</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block responsive-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Araç</th>
                                        <th>Yıl</th>
                                        <th>Fiyat</th>
                                        <th>Kilometre</th>
                                        <th>İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles.map((v) => (
                                        <tr key={v.id}>
                                            <td className="w-1/3">
                                                <div className="flex items-center gap-3">
                                                    <img src={v.images[0] || '/placeholder.png'} className="size-12 rounded object-cover border border-white/5" alt="" />
                                                    <div className="truncate">
                                                        <p className="font-bold text-white truncate">{v.title}</p>
                                                        <p className="text-xs text-secondary">{v.brand} {v.model}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{v.year}</td>
                                            <td className="text-neon font-bold">{v.price.toLocaleString()} ₺</td>
                                            <td className="text-secondary">{v.km.toLocaleString()} km</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button className="btn-base btn-ghost !p-2">
                                                        <span className="material-symbols-outlined text-sm">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(v.id, v.title)}
                                                        className="btn-base btn-ghost !p-2 !text-red-500/70 hover:!bg-red-500/10"
                                                        disabled={deleting === v.id}
                                                    >
                                                        <span className="material-symbols-outlined text-sm">{deleting === v.id ? 'sync' : 'delete'}</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile & Tablet Card View */}
                        <div className="lg:hidden space-y-3">
                            {vehicles.map((v) => (
                                <div key={v.id} className="admin-card p-4">
                                    <div className="flex gap-4">
                                        <img src={v.images[0] || '/placeholder.png'} className="size-16 rounded object-cover" alt="" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-white truncate">{v.title}</h4>
                                            <p className="text-neon font-bold mt-1">{v.price.toLocaleString()} ₺</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] uppercase font-bold text-secondary bg-white/5 px-2 py-0.5 rounded italic">
                                                    {v.year} • {v.km.toLocaleString()} km
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                        <button className="btn-base btn-secondary flex-1">
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={() => handleDelete(v.id, v.title)}
                                            className="btn-base btn-danger flex-1"
                                            disabled={deleting === v.id}
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    )
}
