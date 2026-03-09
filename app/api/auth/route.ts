import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'huzur2024admin'
const SESSION_TOKEN = 'huzur_admin_session_2024'

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json()

        if (password === ADMIN_PASSWORD) {
            const response = NextResponse.json({ success: true, message: 'Giriş başarılı' })
            response.cookies.set('admin_session', SESSION_TOKEN, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            })
            return response
        }

        return NextResponse.json({ success: false, message: 'Şifre hatalı' }, { status: 401 })
    } catch {
        return NextResponse.json({ success: false, message: 'Geçersiz istek' }, { status: 400 })
    }
}
