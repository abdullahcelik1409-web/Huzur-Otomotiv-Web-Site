export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'

// GET: Tek bir aracı getir
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const vehicleId = parseInt(id, 10)

        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId }
        })

        if (!vehicle) {
            return NextResponse.json({ error: 'Araç bulunamadı' }, { status: 404 })
        }

        return NextResponse.json({ success: true, vehicle })
    } catch (error) {
        console.error('Get vehicle error:', error)
        return NextResponse.json({ error: 'Araç bilgileri alınamadı' }, { status: 500 })
    }
}

// DELETE: Aracı sil
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Admin yetkisi kontrolü
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
        }

        const { id } = await params
        const vehicleId = parseInt(id, 10)

        await prisma.vehicle.delete({
            where: { id: vehicleId }
        })

        return NextResponse.json({ success: true, message: 'İlan silindi' })
    } catch (error) {
        console.error('Delete error:', error)
        return NextResponse.json({ error: 'İlan silinemedi' }, { status: 500 })
    }
}

// PATCH/PUT: Aracı güncelle
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Admin yetkisi kontrolü
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
        }

        const { id } = await params
        const vehicleId = parseInt(id, 10)
        const body = await request.json()

        const vehicle = await prisma.vehicle.update({
            where: { id: vehicleId },
            data: {
                ...body,
                year: body.year ? Number(body.year) : undefined,
                price: body.price ? Number(body.price) : undefined,
                km: body.km ? Number(body.km) : undefined,
                updatedAt: new Date()
            }
        })

        return NextResponse.json({ success: true, vehicle })
    } catch (error) {
        console.error('Update error:', error)
        return NextResponse.json({ error: 'Güncelleme yapılamadı' }, { status: 500 })
    }
}
