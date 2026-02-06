import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Hotel, Users, Calendar, Star, TrendingUp, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Link from 'next/link'
import Button from '@/components/ui/Button'

async function getAdminStats() {
  const [hotelsCount, usersCount, bookingsCount, reviewsCount, recentHotels] =
    await Promise.all([
      prisma.hotel.count(),
      prisma.user.count(),
      prisma.booking.count(),
      prisma.review.count(),
      prisma.hotel.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          rooms: true,
        },
      }),
    ])

  return {
    hotelsCount,
    usersCount,
    bookingsCount,
    reviewsCount,
    recentHotels: recentHotels.map((hotel) => ({
      ...hotel,
      images: JSON.parse(hotel.images) as string[],
    })),
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login')
  }

  const stats = await getAdminStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            لوحة الإدارة
          </h1>
          <p className="text-gray-600">
            مرحباً {session.user.name}، إليك ملخص النشاط
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">إجمالي الفنادق</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.hotelsCount}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Hotel className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 ml-1" />
                <span>نشط</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">المستخدمين</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.usersCount}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <span>مسجلين في النظام</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">الحجوزات</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.bookingsCount}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Calendar className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <span>إجمالي الحجوزات</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">التقييمات</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.reviewsCount}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <span>من العملاء</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="p-6 pb-4">
              <h2 className="text-xl font-bold text-gray-900">إجراءات سريعة</h2>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-2 gap-4">
                <Link href="/admin/hotels/new">
                  <Button className="w-full">
                    <Hotel className="w-4 h-4 ml-2" />
                    إضافة فندق
                  </Button>
                </Link>
                <Link href="/admin/hotels">
                  <Button variant="outline" className="w-full">
                    <Hotel className="w-4 h-4 ml-2" />
                    إدارة الفنادق
                  </Button>
                </Link>
                <Link href="/admin/bookings">
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 ml-2" />
                    الحجوزات
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 ml-2" />
                    المستخدمين
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-6 pb-4">
              <h2 className="text-xl font-bold text-gray-900">آخر النشاطات</h2>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Hotel className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {stats.hotelsCount} فندق مسجل
                    </p>
                    <p className="text-xs text-gray-600">في النظام</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {stats.usersCount} مستخدم
                    </p>
                    <p className="text-xs text-gray-600">نشط</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {stats.reviewsCount} تقييم
                    </p>
                    <p className="text-xs text-gray-600">من العملاء</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Hotels */}
        <Card>
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">أحدث الفنادق</h2>
              <Link href="/admin/hotels">
                <Button variant="ghost" size="sm">
                  عرض الكل
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">الفندق</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">المدينة</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">النجوم</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">الغرف</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentHotels.map((hotel) => (
                    <tr key={hotel.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{hotel.name}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{hotel.city}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-900">{hotel.stars}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{hotel.rooms.length} غرفة</td>
                      <td className="py-3 px-4">
                        <Link href={`/hotel/${hotel.id}`}>
                          <Button variant="ghost" size="sm">
                            عرض
                          </Button>
                        </Link>
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
