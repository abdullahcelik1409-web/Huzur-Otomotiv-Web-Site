import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import AdminLayoutClient from '@/components/AdminLayoutClient'
import './admin.css'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    
    // We allow /admin/login and /admin/register to bypass the admin check
    const isAuthPage = pathname === '/admin/login' || pathname === '/admin/register'

    // Check for admin status on the server
    const admin = await isAdmin()

    if (!admin && !isAuthPage) {
        // If not admin and not on login or register page, redirect to login
        redirect('/admin/login')
    }

    if (admin && isAuthPage) {
        // If already admin and on auth page, redirect to dashboard
        redirect('/admin')
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>
}
