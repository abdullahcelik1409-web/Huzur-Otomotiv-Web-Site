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

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div className="header-title">
                    <h1>Yönetim Paneli</h1>
                    <p>{vehicles.length} İlan Listeleniyor</p>
                </div>
                <div className="admin-header-actions">
                    <Link href="/admin/ilan-ekle" className="admin-btn primary">
                        ➕ Yeni İlan Ekle
                    </Link>
                    <button onClick={() => supabase.auth.signOut().then(() => router.push('/admin/login'))} className="admin-btn secondary">
                        Çıkış Yap
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="admin-loading">Veriler yükleniyor...</div>
            ) : vehicles.length === 0 ? (
                <div className="admin-empty">
                    <p>Henüz ilan eklenmemiş.</p>
                </div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Araç</th>
                                <th>Yıl</th>
                                <th>Fiyat</th>
                                <th>KM</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((v) => (
                                <tr key={v.id}>
                                    <td>
                                        <div className="table-vehicle-info">
                                            <img src={v.images[0] || '/placeholder.png'} alt="" className="table-thumb" />
                                            <div>
                                                <div className="table-title">{v.title}</div>
                                                <div className="table-sub">{v.brand} {v.model}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{v.year}</td>
                                    <td>{v.price.toLocaleString()} TL</td>
                                    <td>{v.km.toLocaleString()} km</td>
                                    <td>
                                        <span className={`status-badge ${v.featured ? 'featured' : ''}`}>
                                            {v.featured ? '⭐ Öne Çıkan' : 'Aktif'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                onClick={() => handleDelete(v.id, v.title)}
                                                className="btn-delete"
                                                disabled={deleting === v.id}
                                            >
                                                {deleting === v.id ? '...' : 'Sil'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
