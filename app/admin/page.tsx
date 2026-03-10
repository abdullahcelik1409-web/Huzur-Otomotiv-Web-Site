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
        <main className="p-4 space-y-6 pb-24 lg:pb-10 max-w-7xl mx-auto">
            {/* Header (Desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Hoş Geldiniz, Admin</h1>
                    <p className="text-secondary mt-1">Sistemdeki araç ilanlarını buradan yönetebilirsiniz.</p>
                </div>
                <Link href="/admin/ilan-ekle" className="neon-btn">
                    <span className="material-symbols-outlined mr-2">add_box</span>
                    Yeni İlan Ekle
                </Link>
            </div>

            {/* Statistics Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass p-5 rounded-2xl flex items-center justify-between group hover:border-neon transition-all">
                    <div>
                        <p className="text-sm font-medium text-secondary">Toplam İlan</p>
                        <h3 className="text-3xl font-bold mt-1 text-white">{totalVehicles}</h3>
                        <span className="text-xs font-bold text-neon flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span> Güncel
                        </span>
                    </div>
                    <div className="size-14 bg-neon/10 rounded-xl flex items-center justify-center text-neon group-hover:bg-neon group-hover:text-black transition-all">
                        <span className="material-symbols-outlined text-3xl">analytics</span>
                    </div>
                </div>

                <div className="glass p-5 rounded-2xl flex items-center justify-between group hover:border-neon transition-all">
                    <div>
                        <p className="text-sm font-medium text-secondary">Aktif İlan</p>
                        <h3 className="text-3xl font-bold mt-1 text-white">{activeVehicles}</h3>
                        <span className="text-xs font-bold text-neon flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span> Yayında
                        </span>
                    </div>
                    <div className="size-14 bg-neon/10 rounded-xl flex items-center justify-center text-neon group-hover:bg-neon group-hover:text-black transition-all">
                        <span className="material-symbols-outlined text-3xl">visibility</span>
                    </div>
                </div>

                <div className="glass p-5 rounded-2xl flex items-center justify-between group hover:border-[#ffcc00] transition-all">
                    <div>
                        <p className="text-sm font-medium text-secondary">Öne Çıkan</p>
                        <h3 className="text-3xl font-bold mt-1 text-white">{featuredVehicles}</h3>
                        <span className="text-xs font-bold text-[#ffcc00] flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-sm">star</span> Premium
                        </span>
                    </div>
                    <div className="size-14 bg-[#ffcc00]/10 rounded-xl flex items-center justify-center text-[#ffcc00] group-hover:bg-[#ffcc00] group-hover:text-black transition-all">
                        <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                    </div>
                </div>

                <div className="glass p-5 rounded-2xl flex items-center justify-between group hover:border-red-500 transition-all">
                    <div>
                        <p className="text-sm font-medium text-secondary">Pasif İlan</p>
                        <h3 className="text-3xl font-bold mt-1 text-white">{passiveVehicles}</h3>
                        <span className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-sm">pause_circle</span> Beklemede
                        </span>
                    </div>
                    <div className="size-14 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-3xl">disabled_by_default</span>
                    </div>
                </div>
            </section>

            {/* Quick Actions (Mobile) */}
            <section className="lg:hidden">
                <Link href="/admin/ilan-ekle" className="w-full flex items-center gap-4 bg-neon text-black p-4 rounded-xl font-bold shadow-lg shadow-neon/20 hover:brightness-110 active:scale-95 transition-all">
                    <div className="bg-black/20 p-2 rounded-lg">
                        <span className="material-symbols-outlined">add_box</span>
                    </div>
                    Yeni İlan Ekle
                </Link>
            </section>

            {/* List Section */}
            <section>
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-xl font-bold text-white">Son İlanlar</h2>
                    <p className="text-secondary text-sm">{vehicles.length} kayıt bulundu</p>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-secondary glass rounded-2xl">
                        <div className="inline-block animate-spin size-6 border-2 border-neon border-t-transparent rounded-full mb-2"></div>
                        <p>Yükleniyor...</p>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="p-10 text-center text-secondary glass rounded-2xl">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-20">inventory_2</span>
                        <p>Henüz ilan eklenmemiş.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {vehicles.map((v) => (
                            <div key={v.id} className="glass p-3 rounded-xl hover:border-neon/50 transition-all border border-white/5">
                                <div className="flex gap-4">
                                    <div className="size-20 rounded-lg bg-tertiary overflow-hidden flex-shrink-0 border border-white/5">
                                        <img className="size-full object-cover" src={v.images[0] || '/placeholder.png'} alt={v.title} />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-white truncate">{v.title}</h4>
                                            <p className="text-neon font-bold text-sm mt-0.5">{v.price.toLocaleString()} ₺</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${v.featured ? 'bg-[#ffcc00]/20 text-[#ffcc00]' : 'bg-neon/10 text-neon'}`}>
                                                    {v.featured ? 'Premium' : 'Aktif'}
                                                </span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-secondary font-bold uppercase tracking-wider">
                                                    {v.year}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-1.5 glass rounded-lg text-secondary hover:text-neon transition-colors">
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(v.id, v.title)}
                                                    className="p-1.5 glass rounded-lg text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                                    disabled={deleting === v.id}
                                                >
                                                    <span className="material-symbols-outlined text-sm">{deleting === v.id ? 'sync' : 'delete'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
