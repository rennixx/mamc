import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const ADMIN_SECRET = process.env.ADMIN_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret'

async function verifyAdminToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-auth.session-token')?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(ADMIN_SECRET))
    return payload as { sub: string; email: string; name: string; role: string }
  } catch {
    return null
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side auth check (backup to proxy)
  const adminUser = await verifyAdminToken()

  // DEBUG: Log to see if layout check is working
  console.log('[ADMIN LAYOUT] Admin user:', adminUser)

  if (!adminUser) {
    console.log('[ADMIN LAYOUT] No admin user, redirecting to /admin/login')
    redirect('/admin/login')
  }

  if (adminUser.role !== 'ADMIN' && adminUser.role !== 'STAFF') {
    console.log('[ADMIN LAYOUT] Invalid role:', adminUser.role)
    redirect('/admin/login')
  }

  console.log('[ADMIN LAYOUT] Access granted for', adminUser.email)

  return (
    <div className="min-h-screen flex bg-forest-800">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
