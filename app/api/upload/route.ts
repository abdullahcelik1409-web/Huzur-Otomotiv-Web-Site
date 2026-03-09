import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const SESSION_TOKEN = 'huzur_admin_session_2024'

function isAuthenticated(request: NextRequest): boolean {
    const session = request.cookies.get('admin_session')
    return session?.value === SESSION_TOKEN
}

export async function POST(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const files = formData.getAll('files') as File[]
        const folderName = formData.get('folder') as string || 'uploads'

        if (files.length === 0) {
            return NextResponse.json({ error: 'Dosya yüklenmedi' }, { status: 400 })
        }

        const uploadDir = path.join(process.cwd(), 'public', 'cars', folderName)

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        const uploadedPaths: string[] = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const buffer = Buffer.from(await file.arrayBuffer())

            // Generate filename: folder-1.ext, folder-2.ext ...
            const ext = path.extname(file.name) || '.png'
            const fileName = `${folderName}-${i + 1}${ext}`
            const filePath = path.join(uploadDir, fileName)

            fs.writeFileSync(filePath, buffer)
            uploadedPaths.push(`/cars/${folderName}/${fileName}`)
        }

        return NextResponse.json({ success: true, paths: uploadedPaths })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Yükleme hatası' }, { status: 500 })
    }
}
