import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Users, Shield, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      bookings: true,
      reviews: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return users
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login')
  }

  const users = await getUsers()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المستخدمين</h1>
          <p className="text-gray-600">عرض وإدارة جميع المستخدمين</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">إجمالي المستخدمين</p>
                  <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">المدراء</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {users.filter((u) => u.role === 'ADMIN').length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">المستخدمين العاديين</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {users.filter((u) => u.role === 'USER').length}
                  </p>
                </div>
                <User className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">الاسم</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">البريد الإلكتروني</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">الدور</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">الحجوزات</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">التقييمات</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {user.name?.[0] || 'U'}
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.role === 'ADMIN'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.role === 'ADMIN' ? (
                            <span className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              مدير
                            </span>
                          ) : (
                            'مستخدم'
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{user.bookings.length}</td>
                      <td className="py-3 px-4 text-gray-900">{user.reviews.length}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
