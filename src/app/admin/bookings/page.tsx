import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Calendar, User, Hotel } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

async function getBookings() {
  const bookings = await prisma.booking.findMany({
    include: {
      user: true,
      hotel: true,
      room: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return bookings
}

export default async function AdminBookingsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login')
  }

  const bookings = await getBookings()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الحجوزات</h1>
          <p className="text-gray-600">عرض وإدارة جميع الحجوزات</p>
        </div>

        {bookings.length > 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">المستخدم</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">الفندق</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">الغرفة</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">الدخول</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">الخروج</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">السعر</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{booking.user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Hotel className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{booking.hotel.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{booking.room.name}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(booking.checkIn).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(booking.checkOut).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="py-3 px-4 text-gray-900 font-semibold">
                          {booking.totalPrice.toLocaleString('ar-SA')} ريال
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === 'CONFIRMED'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.status === 'CONFIRMED' ? 'مؤكد' :
                             booking.status === 'PENDING' ? 'معلق' : 'ملغي'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">لا توجد حجوزات حتى الآن</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
