import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import AdminLayoutClient from '@/components/AdminLayoutClient'
import './admin.css'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const headersList = await headers()
    const pathname = headersList.get('x-invoke-path') || ''
    
    // We allow /admin/login to bypass the admin check
    const isLoginPage = pathname === '/admin/login'

    // Check for admin status on the server
    const admin = await isAdmin()

    if (!admin && !isLoginPage) {
        // If not admin and not on login page, redirect to login
        redirect('/admin/login')
    }

    if (admin && isLoginPage) {
        // If already admin and on login page, redirect to dashboard
        redirect('/admin')
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>
}
