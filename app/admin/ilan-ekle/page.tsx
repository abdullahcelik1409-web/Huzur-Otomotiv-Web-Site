'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminIlanEkle() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [isFeatured, setIsFeatured] = useState(false)
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setFiles(prev => [...prev, ...newFiles])

            const newPreviews = newFiles.map(file => URL.createObjectURL(file))
            setPreviews(prev => [...prev, ...newPreviews])
        }
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
        setPreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        const formData = new FormData(e.currentTarget)
        const vehicleData: any = {}
        formData.forEach((value, key) => {
            if (key !== 'images' && key !== 'featured') {
                vehicleData[key] = value
            }
        })

        try {
            const uploadedUrls = []
            for (const file of files) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `cars/${fileName}`

                const { error } = await supabase.storage
                    .from('vehicle-images')
                    .upload(filePath, file)

                if (error) throw error

                const { data: { publicUrl } } = supabase.storage
                    .from('vehicle-images')
                    .getPublicUrl(filePath)

                uploadedUrls.push(publicUrl)
            }

            const finalData = {
                ...vehicleData,
                price: parseFloat(vehicleData.price),
                year: parseInt(vehicleData.year),
                km: parseInt(vehicleData.km),
                images: uploadedUrls,
                featured: isFeatured,
                status: 'active'
            }

            const res = await fetch('/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            })

            if (!res.ok) throw new Error('İlan kaydedilemedi')

            setMessage({ type: 'success', text: 'İlan başarıyla oluşturuldu! Yönlendiriliyorsunuz...' })
            setTimeout(() => router.push('/admin'), 2000)

        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Bir hata oluştu' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-[1000px] mx-auto space-y-12 pb-24">
            {/* Header Actions */}
            <div className="admin-header-actions border-none mb-0">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">Yeni <span className="text-neon">İlan Ekle</span></h1>
                    <p className="stat-label mt-1">Araç detaylarını girerek yeni bir ilan yayınlayın.</p>
                </div>
                <button onClick={() => router.back()} className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-white transition-colors">
                    Vazgeç
                </button>
            </div>

            {message.text && (
                <div className={`p-6 rounded-2xl flex items-center gap-4 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    <span className="material-symbols-outlined text-2xl font-black">
                        {message.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <p className="font-bold text-sm tracking-tight">{message.text}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Araç Bilgileri Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-xs font-black text-neon uppercase bg-neon/10 px-3 py-1 rounded-full">01</span>
                        <h2 className="text-xl font-black italic tracking-tighter uppercase">Araç Teknik Detayları</h2>
                    </div>

                    <div className="admin-card space-y-8">
                        <div className="space-y-2">
                            <label className="stat-label">İlan Başlığı</label>
                            <input name="title" type="text" className="w-full h-14 bg-black border border-white/5 rounded-xl px-6 outline-none focus:border-neon transition-all font-bold text-lg" placeholder="Örn: 2023 Mercedes-Benz Sprinter" required />
                        </div>

                        <div className="admin-grid">
                            <div className="col-span-12 md:col-span-6 space-y-2">
                                <label className="stat-label">Marka</label>
                                <input name="brand" type="text" className="w-full h-12 bg-black border border-white/5 rounded-xl px-4 outline-none focus:border-neon transition-all font-bold" placeholder="Örn: Mercedes-Benz" required />
                            </div>
                            <div className="col-span-12 md:col-span-6 space-y-2">
                                <label className="stat-label">Model</label>
                                <input name="model" type="text" className="w-full h-12 bg-black border border-white/5 rounded-xl px-4 outline-none focus:border-neon transition-all font-bold" placeholder="Örn: Sprinter" required />
                            </div>
                            <div className="col-span-12 md:col-span-4 space-y-2">
                                <label className="stat-label">Yıl</label>
                                <input name="year" type="number" className="w-full h-12 bg-black border border-white/5 rounded-xl px-4 outline-none focus:border-neon transition-all font-bold" placeholder="2023" required />
                            </div>
                            <div className="col-span-12 md:col-span-4 space-y-2">
                                <label className="stat-label">Kilometre</label>
                                <input name="km" type="number" className="w-full h-12 bg-black border border-white/5 rounded-xl px-4 outline-none focus:border-neon transition-all font-bold" placeholder="0" required />
                            </div>
                            <div className="col-span-12 md:col-span-4 space-y-2">
                                <label className="stat-label">Fiyat (₺)</label>
                                <input name="price" type="number" className="w-full h-12 bg-black border border-white/5 rounded-xl px-4 outline-none focus:border-neon transition-all font-bold text-neon" placeholder="1.250.000" required />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Fotoğraflar Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-xs font-black text-neon uppercase bg-neon/10 px-3 py-1 rounded-full">02</span>
                        <h2 className="text-xl font-black italic tracking-tighter uppercase">Görsel Galeri</h2>
                    </div>

                    <div className="admin-card">
                        <div className="border-2 border-dashed border-white/5 rounded-2xl p-12 text-center hover:border-neon/30 transition-all relative bg-white/[0.01]">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                            />
                            <div className="size-16 bg-neon/10 rounded-2xl flex items-center justify-center text-neon mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                            </div>
                            <p className="font-bold text-white tracking-tight">Fotoğrafları buraya sürükleyin</p>
                            <p className="stat-label mt-1 lowercase">PNG, JPG, WEBP • Max 5MB</p>
                        </div>

                        {previews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-8">
                                {previews.map((url, i) => (
                                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/5 relative group shadow-2xl">
                                        <img src={url} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="absolute inset-0 bg-red-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                        >
                                            <span className="material-symbols-outlined text-2xl font-black">delete</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Detaylar Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-xs font-black text-neon uppercase bg-neon/10 px-3 py-1 rounded-full">03</span>
                        <h2 className="text-xl font-black italic tracking-tighter uppercase">Ek Özellikler ve Notlar</h2>
                    </div>

                    <div className="admin-card space-y-8">
                        <div className="space-y-2">
                            <label className="stat-label">Araç Açıklaması</label>
                            <textarea name="description" className="w-full bg-black border border-white/5 rounded-xl p-6 outline-none focus:border-neon transition-all font-medium min-h-[160px] text-secondary" placeholder="Araç hakkında detaylı bilgi girin..." required></textarea>
                        </div>

                        <div className="flex items-center gap-4 p-6 bg-black/50 border border-white/5 rounded-2xl group hover:border-neon/20 transition-all cursor-pointer">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    className="peer h-6 w-6 opacity-0 absolute cursor-pointer"
                                />
                                <div className="h-6 w-6 border-2 border-white/10 rounded-md peer-checked:bg-neon peer-checked:border-neon transition-all flex items-center justify-center">
                                    <span className="material-symbols-outlined text-black text-lg font-black scale-0 peer-checked:scale-100 transition-transform">check</span>
                                </div>
                            </div>
                            <label htmlFor="featured" className="font-bold text-secondary group-hover:text-white transition-colors cursor-pointer select-none">
                                Bu İlanı <span className="text-neon italic">"Öne Çıkanlar"</span> Bölümünde Göster
                            </label>
                        </div>
                    </div>
                </section>

                {/* Submit Section */}
                <div className="flex items-center gap-4 pt-10">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium flex-1 !h-16 text-lg"
                    >
                        {loading ? (
                            <div className="spinner !w-6 !h-6"></div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined font-black">verified</span>
                                <span>İlanı Şimdi Yayınla</span>
                            </div>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="h-16 px-12 rounded-2xl bg-white/5 border border-white/10 font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all text-secondary"
                    >
                        İptal Et
                    </button>
                </div>
            </form>
        </div>
    )
}
