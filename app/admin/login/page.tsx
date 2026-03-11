'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error

            // Oturumun tarayıcıya yazılması için çok kısa bir bekleme
            await new Promise(resolve => setTimeout(resolve, 500))

            // Profili senkronize et (ve ilk kullanıcıysa admin yap)
            const syncRes = await fetch('/api/auth/sync', { method: 'POST' })
            
            if (!syncRes.ok) {
                const syncError = await syncRes.json()
                console.error('Sync failed:', syncError)
                // Senkronizasyon başarısız olsa bile kullanıcıyı yönlendirmeyi deneyebiliriz 
                // ya da hata verebiliriz. Güvenlik için yönlendirmeden önce hata verelim.
                throw new Error(syncError.error || 'Profil senkronizasyonu başarısız oldu')
            }

            setMessage({ type: 'success', text: 'Giriş başarılı! Profil doğrulandı, yönlendiriliyorsunuz...' })
            setTimeout(() => router.push('/admin'), 1000)

        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Giriş yapılamadı' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--primary-bg)',
            padding: '24px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: 'var(--secondary-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '48px 32px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--accent-neon-muted)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        color: 'var(--accent-neon)',
                        fontSize: '32px'
                    }}>
                        <span className="material-symbols-outlined">admin_panel_settings</span>
                    </div>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '8px'
                    }}>
                        Admin <span style={{ color: 'var(--accent-neon)' }}>Giriş</span>
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5'
                    }}>
                        Yönetim paneline erişmek için giriş yapın
                    </p>
                </div>

                {/* Message Alert */}
                {message.text && (
                    <div style={{
                        padding: '16px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '24px',
                        background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid ' + (message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'),
                        color: message.type === 'success' ? '#22c55e' : '#ef4444'
                    }}>
                        <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{message.text}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                        <label className="form-label">E-posta Adresi</label>
                        <input
                            name="email"
                            type="email"
                            className="input-base"
                            placeholder="admin@huzurotomotiv.com"
                            required
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Şifre</label>
                        <input
                            name="password"
                            type="password"
                            className="input-base"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{
                            height: '48px',
                            fontSize: '14px',
                            fontWeight: 600,
                            marginTop: '8px'
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                            {loading ? 'sync' : 'login'}
                        </span>
                        <span>{loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}</span>
                    </button>
                </form>

                {/* Footer */}
                <div style={{
                    marginTop: '32px',
                    paddingTop: '24px',
                    borderTop: '1px solid var(--border-color)',
                    textAlign: 'center'
                }}>
                    <p style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5'
                    }}>
                        © 2024 Huzur Otomotiv. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        </div>
    )
}
