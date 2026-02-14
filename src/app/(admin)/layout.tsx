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

  if (!adminUser) {
    redirect('/admin/login')
  }

  if (adminUser.role !== 'ADMIN' && adminUser.role !== 'STAFF') {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-forest-800">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader adminEmail={adminUser.email} adminName={adminUser.name} adminRole={adminUser.role} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
