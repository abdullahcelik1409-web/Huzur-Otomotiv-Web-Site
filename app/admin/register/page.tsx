'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminRegister() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Register attempt started...')
        setLoading(true)
        setMessage({ type: '', text: '' })

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        console.log('Registering email:', email)

        try {
            const { error, data } = await supabase.auth.signUp({
                email,
                password,
                options: {
                   emailRedirectTo: `${window.location.origin}/admin/login`
                }
            })

            if (error) {
                console.error('Supabase sign up error:', error)
                throw error
            }

            console.log('Sign up result:', data)

            if (data.user && data.session) {
                setMessage({ type: 'success', text: 'Hesap başarıyla oluşturuldu! Yönlendiriliyorsunuz...' })
                setTimeout(() => router.push('/admin/login'), 2000)
            } else if (data.user) {
                setMessage({ type: 'success', text: 'Kayıt başarılı! Lütfen e-postanızı onaylayın (veya doğrudan giriş yapmayı deneyin).' })
            } else {
                throw new Error('Kullanıcı oluşturulamadı fakat hata dönmedi.')
            }

        } catch (err: any) {
            console.error('Registration failed:', err)
            setMessage({ type: 'error', text: err.message || 'Kayıt yapılamadı' })
        } finally {
            setLoading(false)
            console.log('Register attempt finished.')
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
                        <span className="material-symbols-outlined">person_add</span>
                    </div>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '8px'
                    }}>
                        Yeni <span style={{ color: 'var(--accent-neon)' }}>Kayıt</span>
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5'
                    }}>
                        Güvenlik testi için yeni bir hesap oluşturun
                    </p>
                    <div style={{ marginTop: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--accent-neon)', background: 'rgba(186, 255, 41, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                            Test Amaçlıdır
                        </span>
                    </div>
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

                {/* Register Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                        <label className="form-label">E-posta Adresi</label>
                        <input
                            name="email"
                            type="email"
                            className="input-base"
                            placeholder="test@huzurotomotiv.com"
                            required
                            disabled={loading}
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
                            minLength={6}
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
                            {loading ? 'sync' : 'how_to_reg'}
                        </span>
                        <span>{loading ? 'Kayıt yapılıyor...' : 'Hesap Oluştur'}</span>
                    </button>
                    
                    <Link href="/admin/login" style={{ 
                        textAlign: 'center', 
                        fontSize: '13px', 
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        marginTop: '8px'
                    }}>
                        Zaten bir hesabınız mı var? <span style={{ color: 'var(--accent-neon)' }}>Giriş Yap</span>
                    </Link>
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
                        Bu sayfa sadece güvenlik testi içindir.
                    </p>
                </div>
            </div>
        </div>
    )
}
