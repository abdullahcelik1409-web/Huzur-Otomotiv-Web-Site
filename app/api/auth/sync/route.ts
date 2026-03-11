import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            console.error('Auth check failed:', userError)
            return NextResponse.json({ 
                error: 'Oturum bulunamadı veya oturum süresi dolmuş. Lütfen tekrar giriş yapın.',
                details: userError?.message
            }, { status: 401 })
        }

        console.log('Syncing profile for user:', user.email)

        // Profili kontrol et veya oluştur
        let profile = await prisma.profile.findUnique({
            where: { id: user.id }
        })

        if (!profile) {
            // Eğer veritabanında hiç kullanıcı yoksa, ilk geleni admin yapabiliriz (Opsiyonel)
            const userCount = await prisma.profile.count()
            
            profile = await prisma.profile.create({
                data: {
                    id: user.id,
                    email: user.email!,
                    isAdmin: userCount === 0 // İlk kullanıcı admin olur
                }
            })
        }

        return NextResponse.json({ success: true, profile })
    } catch (error: any) {
        console.error('Profile sync error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
