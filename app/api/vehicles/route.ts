export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'

// GET: Tüm araçları listele (Admin için)
export async function GET(request: NextRequest) {
    try {
        // Database URL kontrolü
        if (!process.env.DATABASE_URL) {
            console.error('DATABASE_URL env variable is missing!')
            return NextResponse.json(
                { error: 'Veritabanı bağlantısı yapılandırılmamış' },
                { status: 503 }
            )
        }

        // Admin yetkisi kontrolü
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
        }

        const vehicles = await prisma.vehicle.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({ cars: vehicles })
    } catch (error) {
        console.error('Fetch error:', error)
        return NextResponse.json({ error: 'Araçlar yüklenemedi' }, { status: 500 })
    }
}

// POST: Yeni araç ekle
export async function POST(request: NextRequest) {
    try {
        // Admin yetkisi kontrolü
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
        }

        const body = await request.json()
        const { title, brand, model, year, price, km, description, images, featured } = body

        // Validation
        if (!title || !brand || !model || !images || images.length === 0) {
            return NextResponse.json(
                { error: 'Gerekli alanlar: title, brand, model, images' },
                { status: 400 }
            )
        }

        // Slug oluştur (Türkçe karakter düzeltmesi ile)
        const slug = title
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
            .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim() + '-' + Date.now()

        const vehicle = await prisma.vehicle.create({
            data: {
                slug,
                title,
                brand,
                model,
                year: Number(year),
                price: Number(price),
                km: Number(km),
                description: description || '',
                images: images || [],
                featured: Boolean(featured),
                status: 'active'
            }
        })

        return NextResponse.json({ success: true, vehicle }, { status: 201 })
    } catch (error: any) {
        console.error('Create error:', error)
        const message = error?.message || 'Araç oluşturulamadı'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
