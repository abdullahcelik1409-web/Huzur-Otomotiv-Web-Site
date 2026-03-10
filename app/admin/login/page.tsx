'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import './login.css'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) router.push('/admin')
        }
        checkSession()
    }, [router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) throw authError

            router.push('/admin')
            router.refresh()
        } catch (err: any) {
            setError('Giriş yapılamadı. Bilgilerinizi kontrol edin.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                {/* Header */}
                <div className="login-header">
                    <div className="login-icon">
                        <span className="material-symbols-outlined">directions_car</span>
                    </div>
                    <h1>Huzur <span className="neon">Otomotiv</span></h1>
                    <p>Yönetici Paneli Erişimi</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="login-form">
                    {error && (
                        <div className="error-message">
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="form-group">
                        <label className="form-label">E-posta Adresi</label>
                        <div className="form-input-wrapper">
                            <span className="form-input-icon material-symbols-outlined">mail</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-base"
                                placeholder="admin@huzurotomotiv.com"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label className="form-label">Şifre</label>
                        <div className="form-input-wrapper">
                            <span className="form-input-icon material-symbols-outlined">lock</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-base"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Giriş Yapılıyor...
                            </>
                        ) : (
                            'Giriş Yap'
                        )}
                    </button>
                </form>

                {/* Footer Note */}
                <div style={{
                    marginTop: '24px',
                    paddingTop: '24px',
                    borderTop: '1px solid var(--border-color)',
                    textAlign: 'center'
                }}>
                    <p style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Giriş bilgileriniz güvenli bir şekilde korunmaktadır
                    </p>
                </div>
            </div>
        </div>
    )
}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-base btn-primary w-full !h-14 !text-base group"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin">sync</span>
                            ) : (
                                <>
                                    <span>Giriş Yap</span>
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Note */}
                <div style={{
                    marginTop: '24px',
                    paddingTop: '24px',
                    borderTop: '1px solid var(--border-color)',
                    textAlign: 'center'
                }}>
                    <p style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Giriş bilgileriniz güvenli bir şekilde korunmaktadır
                    </p>
                </div>
            </div>
        </div>
    )
}
