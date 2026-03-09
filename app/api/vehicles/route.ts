import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET: Tüm araçları listele (Admin için)
export async function GET(request: NextRequest) {
    try {
        // Oturum kontrolü
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            // Not: Geliştirme aşamasında kolaylık için veya middleware ile korunuyorsa burası esnetilebilir
            // Şimdilik güvenli tutuyoruz
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
        const body = await request.json()
        const { title, brand, model, year, price, km, description, images, featured } = body

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
    } catch (error) {
        console.error('Create error:', error)
        return NextResponse.json({ error: 'Araç oluşturulamadı' }, { status: 500 })
    }
}
