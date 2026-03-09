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
        fuel: 'Dizel',
        transmission: 'Otomatik',
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
        <div className="admin-form-page">
            <div className="admin-header">
                <h1>➕ Yeni İlan Ekle</h1>
                <Link href="/admin" className="admin-btn secondary">
                    ← Dashboard&apos;a Dön
                </Link>
            </div>

            {error && <div className="form-error">⚠️ {error}</div>}
            {success && <div className="form-success">✅ {success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="admin-form-card">
                    <h3>🚗 Araç Bilgileri</h3>
                    <div className="form-group">
                        <label>İlan Başlığı *</label>
                        <input name="title" type="text" className="form-input" placeholder="Ör: 2020 Range Rover Vogue" value={form.title} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Marka *</label>
                            <input name="brand" type="text" className="form-input" value={form.brand} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Model</label>
                            <input name="model" type="text" className="form-input" value={form.model} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Yıl *</label>
                            <input name="year" type="number" className="form-input" value={form.year} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Fiyat (TL) *</label>
                            <input name="price" type="number" className="form-input" value={form.price} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Kilometre *</label>
                        <input name="km" type="number" className="form-input" value={form.km} onChange={handleChange} required />
                    </div>
                </div>

                <div className="admin-form-card">
                    <h3>📝 Açıklama</h3>
                    <div className="form-group">
                        <textarea name="description" className="form-input form-textarea" rows={6} value={form.description} onChange={handleChange} placeholder="Araç hakkında detaylı bilgi..." />
                    </div>
                </div>

                <div className="admin-form-card">
                    <h3>📸 Fotoğraflar</h3>
                    <div className="file-upload-area">
                        <p>{uploading ? '⬆️ Yükleniyor...' : 'Fotoğrafları seçmek için tıklayın'}</p>
                        <input type="file" accept="image/*" multiple onChange={handleFileSelect} disabled={uploading} />
                    </div>
                    {previewImages.length > 0 && (
                        <div className="upload-preview-grid">
                            {previewImages.map((src, idx) => (
                                <div key={idx} className="upload-preview-item">
                                    <img src={src} alt="Preview" />
                                    <button type="button" className="upload-preview-remove" onClick={() => removeImage(idx)}>✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="admin-form-card">
                    <div className="form-checkbox-group">
                        <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} id="featured" />
                        <label htmlFor="featured">Öne Çıkan İlan</label>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="admin-btn primary" disabled={loading || uploading}>
                            {loading ? '⏳ Kaydediliyor...' : '✅ İlanı Yayınla'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
