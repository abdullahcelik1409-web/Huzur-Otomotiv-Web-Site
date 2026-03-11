'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminIlanEkle() {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [existingImages, setExistingImages] = useState<string[]>([])
    const [isFeatured, setIsFeatured] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get('id')
    const [formDataState, setFormDataState] = useState<any>({
        title: '',
        brand: '',
        model: '',
        year: '',
        km: '',
        price: '',
        description: ''
    })

    useEffect(() => {
        if (editId) {
            setFetching(true)
            fetch(`/api/vehicles/${editId}`)
                .then(res => res.json())
                .then(data => {
                    const vehicle = data.vehicle || data
                    if (vehicle) {
                        setFormDataState({
                            title: vehicle.title || '',
                            brand: vehicle.brand || '',
                            model: vehicle.model || '',
                            year: vehicle.year?.toString() || '',
                            km: vehicle.km?.toString() || '',
                            price: vehicle.price?.toString() || '',
                            description: vehicle.description || ''
                        })
                        setIsFeatured(!!vehicle.featured)
                        setExistingImages(vehicle.images || [])
                        setPreviews(vehicle.images || [])
                    }
                })
                .catch(err => console.error('Error fetching vehicle for edit:', err))
                .finally(() => setFetching(false))
        }
    }, [editId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormDataState((prev: any) => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setFiles(prev => [...prev, ...newFiles])

            const newPreviews = newFiles.map(file => URL.createObjectURL(file))
            setPreviews(prev => [...prev, ...newPreviews])
        }
    }

    const removeFile = (index: number) => {
        if (index < existingImages.length) {
            // Removing an existing image
            setExistingImages(prev => prev.filter((_, i) => i !== index))
            setPreviews(prev => prev.filter((_, i) => i !== index))
        } else {
            // Removing a newly uploaded image
            const fileIndex = index - existingImages.length
            setFiles(prev => prev.filter((_, i) => i !== fileIndex))
            setPreviews(prev => prev.filter((_, i) => i !== index))
        }
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
            if (!files.length && !existingImages.length) {
                throw new Error('En az bir resim seçmeniz gerekiyor')
            }

            const uploadedUrls = [...existingImages]
            for (const file of files) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `cars/${fileName}`

                const { error, data } = await supabase.storage
                    .from('vehicle-images')
                    .upload(filePath, file)

                if (error) {
                    console.error('Upload error:', error)
                    throw new Error(`Resim yüklenirken hata: ${error.message}`)
                }

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

            const res = await fetch(editId ? `/api/vehicles/${editId}` : '/api/vehicles', {
                method: editId ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.error || 'İlan kaydedilemedi')
            }

            setMessage({ type: 'success', text: editId ? 'İlan başarıyla güncellendi! Yönlendiriliyorsunuz...' : 'İlan başarıyla oluşturuldu! Yönlendiriliyorsunuz...' })
            setTimeout(() => router.push('/admin'), 2000)

        } catch (err: any) {
            console.error('Submit error:', err)
            setMessage({ type: 'error', text: err.message || 'Bir hata oluştu' })
        } finally {
            setLoading(false)
        }
    }

    const steps = [
        { number: 1, title: 'Araç Bilgileri', icon: 'info' },
        { number: 2, title: 'Görsel Galeri', icon: 'image' },
        { number: 3, title: 'Detaylar', icon: 'description' },
    ]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="section-title">{editId ? 'İlanı' : 'Yeni'} <span className="neon">{editId ? 'Düzenle' : 'İlan Ekle'}</span></h1>
                    <p className="section-subtitle">{editId ? 'Araç bilgilerini güncelleyin.' : 'Araç detaylarını adım adım girerek yeni bir ilan yayınlayın.'}</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="btn btn-secondary btn-small"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            {/* Steps Indicator */}
            <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center'
            }}>
                {steps.map((step) => (
                    <button
                        key={step.number}
                        onClick={() => setCurrentStep(step.number)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '16px',
                            background: currentStep >= step.number ? 'var(--accent-neon-muted)' : 'transparent',
                            border: '1px solid ' + (currentStep >= step.number ? 'var(--accent-neon)' : 'var(--border-color)'),
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            flex: 1
                        }}
                        onMouseEnter={(e) => {
                            if (currentStep >= step.number) {
                                (e.currentTarget as HTMLElement).style.background = 'var(--accent-neon-muted)'
                                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (currentStep >= step.number) {
                                (e.currentTarget as HTMLElement).style.background = 'var(--accent-neon-muted)'
                                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                            }
                        }}
                    >
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: currentStep >= step.number ? 'var(--accent-neon)' : 'var(--secondary-bg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: currentStep >= step.number ? 'black' : 'var(--text-secondary)',
                            fontWeight: 700
                        }}>
                            {currentStep > step.number ? (
                                <span className="material-symbols-outlined">check</span>
                            ) : (
                                step.number
                            )}
                        </div>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: currentStep >= step.number ? 'var(--text-primary)' : 'var(--text-secondary)'
                        }}>
                            {step.title}
                        </span>
                    </button>
                ))}
            </div>

            {/* Message Alert */}
            {message.text && (
                <div style={{
                    padding: '16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid ' + (message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'),
                    color: message.type === 'success' ? '#22c55e' : '#ef4444'
                }}>
                    <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Step 1: Vehicle Details */}
                {currentStep >= 1 && (
                    <div className="admin-card" style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                        <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                            <h2 style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Araç Teknik Bilgileri</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">İlan Başlığı</label>
                                <input
                                    name="title"
                                    type="text"
                                    className="input-base"
                                    placeholder="Örn: 2023 Mercedes-Benz Sprinter"
                                    required
                                    disabled={loading || fetching}
                                    value={formDataState.title}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Marka</label>
                                    <input
                                        name="brand"
                                        type="text"
                                        className="input-base"
                                        placeholder="Örn: Mercedes-Benz"
                                        required
                                        disabled={loading || fetching}
                                        value={formDataState.brand}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Model</label>
                                    <input
                                        name="model"
                                        type="text"
                                        className="input-base"
                                        placeholder="Örn: Sprinter"
                                        required
                                        disabled={loading || fetching}
                                        value={formDataState.model}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Yıl</label>
                                    <input
                                        name="year"
                                        type="number"
                                        className="input-base"
                                        placeholder="2023"
                                        required
                                        disabled={loading || fetching}
                                        value={formDataState.year}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Kilometre</label>
                                    <input
                                        name="km"
                                        type="number"
                                        className="input-base"
                                        placeholder="0"
                                        required
                                        disabled={loading || fetching}
                                        value={formDataState.km}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Fiyat (₺)</label>
                                    <input
                                        name="price"
                                        type="number"
                                        className="input-base"
                                        placeholder="1250000"
                                        required
                                        disabled={loading || fetching}
                                        value={formDataState.price}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                className="btn btn-primary"
                                style={{ marginTop: '16px' }}
                            >
                                <span>Devam Et</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Gallery */}
                {currentStep >= 2 && (
                    <div className="admin-card" style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                        <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                            <h2 style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Görsel Galeri</h2>
                        </div>

                        <div style={{
                            border: '2px dashed var(--border-color)',
                            borderRadius: '12px',
                            padding: '40px 24px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            background: 'rgba(204, 255, 0, 0.01)',
                            transition: 'all 0.3s ease'
                        }}
                            onDragOver={(e) => {
                                e.preventDefault()
                                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-neon)'
                                ;(e.currentTarget as HTMLElement).style.background = 'var(--accent-neon-muted)'
                            }}
                            onDragLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'
                                ;(e.currentTarget as HTMLElement).style.background = 'rgba(204, 255, 0, 0.01)'
                            }}
                            onDrop={(e) => {
                                e.preventDefault()
                                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'
                                ;(e.currentTarget as HTMLElement).style.background = 'rgba(204, 255, 0, 0.01)'
                                const input = (e.currentTarget as HTMLElement).querySelector('input') as HTMLInputElement
                                if (input && e.dataTransfer?.files) {
                                    input.files = e.dataTransfer.files
                                    handleFileChange({ target: input } as any)
                                }
                            }}
                        >
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                accept="image/*"
                                disabled={loading}
                            />
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'var(--accent-neon-muted)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent-neon)',
                                fontSize: '24px',
                                margin: '0 auto 12px'
                            }}>
                                <span className="material-symbols-outlined">add_a_photo</span>
                            </div>
                            <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Fotoğrafları buraya sürükleyin</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>PNG, JPG, WEBP • Max 5MB</p>
                        </div>

                        {previews.length > 0 && (
                            <>
                                <p style={{
                                    marginTop: '24px',
                                    marginBottom: '12px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    color: 'var(--text-secondary)',
                                    letterSpacing: '0.5px'
                                }}>
                                    {previews.length} fotoğraf yüklendi
                                </p>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                    gap: '12px'
                                }}>
                                    {previews.map((url, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                aspectRatio: '1',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                border: '1px solid var(--border-color)',
                                                position: 'relative'
                                            }}
                                            onMouseEnter={(e) => {
                                                const btn = (e.currentTarget as HTMLElement).querySelector('button') as HTMLElement
                                                if (btn) btn.style.opacity = '1'
                                            }}
                                            onMouseLeave={(e) => {
                                                const btn = (e.currentTarget as HTMLElement).querySelector('button') as HTMLElement
                                                if (btn) btn.style.opacity = '0'
                                            }}
                                        >
                                            <img
                                                src={url}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                alt={`Preview ${i}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFile(i)}
                                                style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'rgba(239, 68, 68, 0.8)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    opacity: 0,
                                                    transition: 'opacity 0.2s ease',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            marginTop: '24px'
                        }}>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className="btn btn-secondary"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                                <span>Geri</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(3)}
                                className="btn btn-primary"
                            >
                                <span>Devam Et</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Details */}
                {currentStep >= 3 && (
                    <div className="admin-card" style={{ display: currentStep === 3 ? 'block' : 'none' }}>
                        <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                            <h2 style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>Ek Özellikler</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Araç Açıklaması</label>
                                <textarea
                                    name="description"
                                    className="textarea-base"
                                    placeholder="Araç hakkında detaylı bilgi girin..."
                                    required
                                    disabled={loading || fetching}
                                    value={formDataState.description}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div style={{
                                padding: '16px',
                                background: 'var(--secondary-bg)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                                onClick={() => setIsFeatured(!isFeatured)}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-neon)'
                                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(204, 255, 0, 0.02)'
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'
                                    ;(e.currentTarget as HTMLElement).style.background = 'var(--secondary-bg)'
                                }}
                            >
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid ' + (isFeatured ? 'var(--accent-neon)' : 'var(--border-color)'),
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isFeatured ? 'var(--accent-neon)' : 'transparent',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {isFeatured && (
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'black' }}>check</span>
                                    )}
                                </div>
                                <label style={{ cursor: 'pointer', userSelect: 'none', fontSize: '13px', fontWeight: 600 }}>
                                    Bu İlanı <span style={{ color: 'var(--accent-neon)' }}>"Öne Çıkanlar"</span> Bölümünde Göster
                                </label>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '12px',
                                marginTop: '24px'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(2)}
                                    className="btn btn-secondary"
                                    disabled={loading}
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    <span>Geri</span>
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    <span className="material-symbols-outlined">{loading ? 'sync' : 'check'}</span>
                                    <span>{loading ? 'Yayınlanıyor...' : (editId ? 'İlanı Güncelle' : 'İlanı Yayınla')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}
