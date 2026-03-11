import { createClient } from './supabase-server'
import { prisma } from './prisma'

export async function isAdmin() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) return false

        const profile = await prisma.profile.findUnique({
            where: { id: user.id }
        })

        return !!profile?.isAdmin
    } catch (error) {
        console.error('isAdmin check error:', error)
        return false
    }
}
