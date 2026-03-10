'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminIlanEkle() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [previewImages, setPreviewImages] = useState<string[]>([])

    const [form, setForm] = useState({
        title: '',
        brand: '',
        model: '',
        package: '',
        year: new Date().getFullYear(),
        price: '',
        km: '',
        fuel: 'Benzin',
        transmission: 'Otomatik',
        bodyType: 'Sedan',
        color: '',
        engineSize: '',
        traction: 'Arkadan İtiş',
        description: '',
        featured: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        setUploading(true)
        setError('')

        for (const file of files) {
            try {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
                const filePath = `vehicles/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('vehicles')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('vehicles')
                    .getPublicUrl(filePath)

                setPreviewImages(prev => [...prev, publicUrl])
            } catch (err: any) {
                console.error('Upload error:', err)
                setError('Bazı resimler yüklenemedi: ' + err.message)
            }
        }
        setUploading(false)
    }

    const removeImage = (index: number) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const vehicleData = {
                ...form,
                year: Number(form.year),
                price: Number(form.price),
                km: Number(form.km),
                images: previewImages
            }

            const res = await fetch('/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vehicleData),
            })

            const data = await res.json()

            if (data.success) {
                setSuccess('İlan başarıyla eklendi! Yönlendiriliyorsunuz...')
                setTimeout(() => router.push('/admin'), 1500)
            } else {
                setError(data.error || 'İlan eklenirken bir hata oluştu')
            }
        } catch (err) {
            setError('Bağlantı hatası oluştu. Lütfen tekrar deneyin.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-10 max-w-5xl mx-auto w-full">
            {/* Header */}
            <header className="p-6 lg:px-0 lg:py-8 border-b border-white/5 bg-black/5 lg:bg-transparent sticky top-0 z-30 backdrop-blur-md lg:static">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 rounded-lg glass lg:hidden">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-white">İlan Yayınla</h2>
                        <p className="text-secondary text-sm">Yeni aracınızı sisteme ekleyin ve satışa başlayın.</p>
                    </div>
                </div>
            </header>

            <div className="p-6 lg:p-0 mt-6 w-full">
                {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span> {error}
                </div>}
                {success && <div className="mb-6 p-4 bg-neon/10 border border-neon/20 text-neon rounded-xl flex items-center gap-2">
                    <span className="material-symbols-outlined">check_circle</span> {success}
                </div>}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section 1: Vehicle Info */}
                    <section className="glass rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                            <span className="material-symbols-outlined text-neon">info</span>
                            <h3 className="text-lg font-bold text-white">Araç Bilgileri</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-3">
                                <label className="block text-sm font-medium text-secondary mb-2">İlan Başlığı *</label>
                                <input name="title" value={form.title} onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon outline-none transition-all" placeholder="Örn: Hatasız Boyasız 2022 Model BMW 320i" type="text" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">Marka *</label>
                                <input name="brand" value={form.brand} onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon outline-none transition-all" placeholder="Örn: BMW" type="text" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">Model</label>
                                <input name="model" value={form.model} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon outline-none transition-all" placeholder="Örn: 320i Sedan" type="text" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">Yıl *</label>
                                <input name="year" value={form.year} onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon outline-none transition-all" placeholder="2023" type="number" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">Fiyat (TL) *</label>
                                <div className="relative">
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-bold">₺</span>
                                    <input name="price" value={form.price} onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon outline-none transition-all pr-10" placeholder="2.450.000" type="number" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">Kilometre *</label>
                                <div className="relative">
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary text-xs">KM</span>
                                    <input name="km" value={form.km} onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon outline-none transition-all pr-12" placeholder="12.500" type="number" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Technical Details */}
                    <section className="glass rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                            <span className="material-symbols-outlined text-neon">engineering</span>
                            <h3 className="text-lg font-bold text-white">Teknik Detaylar</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">Yakıt Tipi</label>
                                <select name="fuel" value={form.fuel} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon outline-none transition-all">
                                    <option className="bg-tertiary">Benzin</option>
                                    <option className="bg-tertiary">Dizel</option>
                                    <option className="bg-tertiary">Hibrit</option>
                                    <option className="bg-tertiary">Elektrikli</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">Vites Tipi</label>
                                <select name="transmission" value={form.transmission} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon outline-none transition-all">
                                    <option className="bg-tertiary">Otomatik</option>
                                    <option className="bg-tertiary">Yarı-Otomatik</option>
                                    <option className="bg-tertiary">Manuel</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">Kasa Tipi</label>
                                <select name="bodyType" value={form.bodyType} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon outline-none transition-all">
                                    <option className="bg-tertiary">Sedan</option>
                                    <option className="bg-tertiary">Hatchback</option>
                                    <option className="bg-tertiary">SUV</option>
                                    <option className="bg-tertiary">Coupe</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">Renk</label>
                                <input name="color" value={form.color} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon outline-none transition-all" placeholder="Metalik Gri" type="text" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">Motor Hacmi</label>
                                <input name="engineSize" value={form.engineSize} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon outline-none transition-all" placeholder="1600 cc" type="text" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-2">Çekiş</label>
                                <select name="traction" value={form.traction} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon outline-none transition-all">
                                    <option className="bg-tertiary">Arkadan İtiş</option>
                                    <option className="bg-tertiary">Önden Çekiş</option>
                                    <option className="bg-tertiary">4x4</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Description */}
                    <section className="glass rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                            <span className="material-symbols-outlined text-neon">description</span>
                            <h3 className="text-lg font-bold text-white">Açıklama</h3>
                        </div>
                        <textarea name="description" value={form.description} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon outline-none transition-all resize-none" placeholder="Araç hakkında detaylı bilgi verin (Donanımlar, boya-değişen durumu, servis bakımları vb.)" rows={6}></textarea>
                    </section>

                    {/* Section 4: Photo Upload */}
                    <section className="glass rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-neon">add_a_photo</span>
                                <h3 className="text-lg font-bold text-white">Fotoğraflar</h3>
                            </div>
                            <span className="text-xs text-secondary bg-white/5 px-3 py-1 rounded-full border border-white/10">Maks. 20 Fotoğraf</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {/* Add Photo Button */}
                            <label className="aspect-square border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-neon/50 hover:bg-neon/5 transition-all group">
                                <span className="material-symbols-outlined text-secondary group-hover:text-neon transition-colors text-3xl">cloud_upload</span>
                                <span className="text-xs text-secondary font-medium">{uploading ? 'Yükleniyor...' : 'Fotoğraf Ekle'}</span>
                                <input accept="image/*" multiple onChange={handleFileSelect} className="hidden" type="file" disabled={uploading} />
                            </label>

                            {/* Thumbnail Previews */}
                            {previewImages.map((src, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 group">
                                    <img className="w-full h-full object-cover" src={src} alt="Preview" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" onClick={() => removeImage(idx)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                    {idx === 0 && <div className="absolute top-2 left-2 px-2 py-0.5 bg-neon text-black text-[10px] font-bold rounded shadow-md">Kapak</div>}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 5: Showcase */}
                    <section className="glass rounded-2xl p-6 border border-white/5">
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <div className="relative inline-flex items-center">
                                <input name="featured" checked={form.featured} onChange={handleChange} className="sr-only peer" type="checkbox" />
                                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon"></div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-white group-hover:text-neon transition-colors">Bu ilanı vitrine çıkar</h4>
                                <p className="text-xs text-secondary">İlanınız ana sayfada en üstte ve &quot;Öne Çıkanlar&quot; bölümünde listelenir.</p>
                            </div>
                            <span className="material-symbols-outlined text-neon">verified</span>
                        </label>
                    </section>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex justify-end gap-3 mt-10">
                        <Link href="/admin" className="px-8 text-secondary font-semibold py-4 rounded-xl hover:text-red-400 transition-all flex items-center justify-center">
                            Vazgeç
                        </Link>
                        <button type="submit" disabled={loading || uploading} className="neon-btn px-12 py-4">
                            {loading ? 'Yayınlanıyor...' : 'İlanı Yayınla'}
                        </button>
                    </div>

                    {/* Mobile Action Spacing */}
                    <div className="h-10 lg:hidden"></div>
                </form>
            </div>

            {/* Sticky Mobile Footer Actions */}
            <footer className="fixed bottom-16 lg:hidden left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/5 p-4 z-40">
                <div className="flex gap-3">
                    <button onClick={(e: any) => { e.preventDefault(); (document.querySelector('form') as any).requestSubmit(); }} disabled={loading || uploading} className="flex-1 bg-neon text-black font-bold py-4 rounded-xl shadow-lg shadow-neon/20 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined font-bold">publish</span>
                        {loading ? '...' : 'İlanı Yayınla'}
                    </button>
                    <Link href="/admin" className="px-6 glass text-white font-bold py-4 rounded-xl flex items-center justify-center">
                        Vazgeç
                    </Link>
                </div>
            </footer>
        </main>
    )
}
