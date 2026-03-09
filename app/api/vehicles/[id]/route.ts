import { PrismaClient } from '@/app/generated/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const prisma = new PrismaClient()

// DELETE: Aracı sil
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Auth kontrolü
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            // Middleware veya Auth kontrolü eklenebilir
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
        const { id } = await params
        const vehicleId = parseInt(id, 10)
        const body = await req.json()

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
