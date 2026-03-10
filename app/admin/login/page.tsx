'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 selection:bg-neon selection:text-black">
            <div className="w-full max-w-md space-y-8">
                {/* Logo & Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center size-16 bg-neon rounded-2xl text-black mb-2 shadow-lg shadow-neon/20">
                        <span className="material-symbols-outlined text-4xl font-bold">directions_car</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Huzur <span className="text-neon">Otomotiv</span></h1>
                        <p className="text-secondary text-sm mt-2 font-medium">Yönetici Paneli Erişimi</p>
                    </div>
                </div>

                {/* Login Form */}
                <div className="admin-card !p-8 border border-white/5 bg-tertiary/50 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon/50 to-transparent"></div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl flex items-center gap-2 animate-shake">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label !text-xs !uppercase !tracking-widest">E-posta Adresi</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary text-lg">mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-base !pl-12"
                                    placeholder="admin@huzurotomotiv.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label !text-xs !uppercase !tracking-widest">Şifre</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary text-lg">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-base !pl-12"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

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

                {/* Footer Links */}
                <div className="text-center space-y-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-white transition-colors text-sm font-medium">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Web Sitesine Dön
                    </Link>
                    <p className="text-[10px] text-muted uppercase tracking-widest opacity-50">
                        &copy; 2024 Huzur Otomotiv • Tüm Hakları Saklıdır
                    </p>
                </div>
            </div>
        </div>
    )
}
