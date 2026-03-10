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
            // 1. Upload Images to Supabase
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

            // 2. Save to Database via API
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
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Yeni İlan Ekle</h1>
                    <p className="text-secondary text-sm mt-1">Araç detaylarını girerek yeni bir ilan oluşturun.</p>
                </div>
                <button onClick={() => router.back()} className="btn-base btn-ghost">
                    Vazgeç
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    <span className="material-symbols-outlined">
                        {message.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Araç Bilgileri Section */}
                <section className="admin-card space-y-6">
                    <h2 className="section-title border-b border-white/5 pb-4">Araç Bilgileri</h2>

                    <div className="form-group">
                        <label className="form-label">İlan Başlığı</label>
                        <input name="title" type="text" className="input-base" placeholder="Örn: 2023 Mercedes-Benz Sprinter" required />
                    </div>

                    <div className="grid-12">
                        <div className="col-span-12 md:col-span-6 form-group">
                            <label className="form-label">Marka</label>
                            <input name="brand" type="text" className="input-base" placeholder="Örn: Mercedes-Benz" required />
                        </div>
                        <div className="col-span-12 md:col-span-6 form-group">
                            <label className="form-label">Model</label>
                            <input name="model" type="text" className="input-base" placeholder="Örn: Sprinter" required />
                        </div>
                        <div className="col-span-12 md:col-span-4 form-group">
                            <label className="form-label">Yıl</label>
                            <input name="year" type="number" className="input-base" placeholder="2023" required />
                        </div>
                        <div className="col-span-12 md:col-span-4 form-group">
                            <label className="form-label">Kilometre</label>
                            <input name="km" type="number" className="input-base" placeholder="0" required />
                        </div>
                        <div className="col-span-12 md:col-span-4 form-group">
                            <label className="form-label">Fiyat (₺)</label>
                            <input name="price" type="number" className="input-base" placeholder="1.250.000" required />
                        </div>
                    </div>
                </section>

                {/* Fotoğraflar Section */}
                <section className="admin-card space-y-6">
                    <h2 className="section-title border-b border-white/5 pb-4">Fotoğraflar</h2>

                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-neon/50 transition-colors relative">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                        />
                        <span className="material-symbols-outlined text-4xl text-secondary mb-2">add_a_photo</span>
                        <p className="text-sm text-secondary">Fotoğrafları buraya sürükleyin veya tıklayın</p>
                        <p className="text-[10px] text-muted mt-1">PNG, JPG veya WEBP (Max 5MB)</p>
                    </div>

                    {previews.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {previews.map((url, i) => (
                                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/10 relative group">
                                    <img src={url} className="size-full object-cover" alt="" />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="absolute top-1 right-1 size-6 bg-red-500 rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform"
                                    >
                                        <span className="material-symbols-outlined text-xs">close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Detaylar Section */}
                <section className="admin-card space-y-6">
                    <h2 className="section-title border-b border-white/5 pb-4">Detaylar</h2>

                    <div className="form-group">
                        <label className="form-label">İlan Açıklaması</label>
                        <textarea name="description" className="input-base" placeholder="Araç hakkında detaylı bilgi girin..." required></textarea>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-neon/5 rounded-xl border border-neon/10">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                            className="size-5 accent-neon rounded cursor-pointer"
                        />
                        <label htmlFor="featured" className="text-sm font-bold cursor-pointer select-none">
                            Bu İlanı "Öne Çıkanlar" Bölümüne Ekle
                        </label>
                    </div>
                </section>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-base btn-primary flex-1 !h-12 text-base"
                    >
                        {loading ? (
                            <span className="animate-spin material-symbols-outlined">sync</span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">publish</span>
                                İlanı Yayınla
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="btn-base btn-secondary sm:px-12 !h-12"
                    >
                        İptal
                    </button>
                </div>
            </form>
        </div>
    )
}
