import { NextRequest, NextResponse } from 'next/server'

const SESSION_TOKEN = 'huzur_admin_session_2024'

export async function GET(request: NextRequest) {
    const session = request.cookies.get('admin_session')

    if (session?.value === SESSION_TOKEN) {
        return NextResponse.json({ authenticated: true })
    }

    return NextResponse.json({ authenticated: false }, { status: 401 })
}
