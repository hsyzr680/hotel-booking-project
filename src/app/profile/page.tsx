import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { User, Mail, Calendar, Star, Hotel } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import CancelBookingButton from '@/components/booking/CancelBookingButton'

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      bookings: {
        include: {
          hotel: true,
          room: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      reviews: {
        include: {
          hotel: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      favorites: {
        include: {
          hotel: true,
        },
      },
    },
  })

  return user
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const userData = await getUserData(session.user.id)

  if (!userData) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الملف الشخصي</h1>
          <p className="text-gray-600">مرحباً {userData.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                    {userData.name?.[0] || 'U'}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{userData.name}</h2>
                  <p className="text-gray-600">{userData.email}</p>
                </div>

                <div className="space-y-4 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الحجوزات</span>
                    <span className="font-semibold text-gray-900">{userData.bookings.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">التقييمات</span>
                    <span className="font-semibold text-gray-900">{userData.reviews.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">المفضلة</span>
                    <span className="font-semibold text-gray-900">{userData.favorites.length}</span>
                  </div>
                </div>

                {userData.role === 'ADMIN' && (
                  <div className="mt-6 pt-6 border-t">
                    <Link href="/admin">
                      <Button className="w-full">
                        الذهاب للوحة الإدارة
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bookings */}
            <Card>
              <CardHeader className="p-6">
                <h3 className="text-xl font-bold text-gray-900">حجوزاتي</h3>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {userData.bookings.length > 0 ? (
                  <div className="space-y-4">
                    {userData.bookings.map((booking) => (
                      <div key={booking.id} className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <Hotel className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1">{booking.hotel.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{booking.room.name}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span>
                              {new Date(booking.checkIn).toLocaleDateString('ar-SA')} - {new Date(booking.checkOut).toLocaleDateString('ar-SA')}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status === 'CONFIRMED' ? 'مؤكد' :
                               booking.status === 'PENDING' ? 'معلق' :
                               booking.status === 'COMPLETED' ? 'مكتمل' : 'ملغي'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="text-left">
                            <p className="text-lg font-bold text-gray-900">{booking.totalPrice.toLocaleString('ar-SA')} ريال</p>
                          </div>
                          <CancelBookingButton bookingId={booking.id} status={booking.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">لا توجد حجوزات حتى الآن</p>
                    <Link href="/search">
                      <Button variant="outline" size="sm" className="mt-4">
                        ابحث عن فندق
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader className="p-6">
                <h3 className="text-xl font-bold text-gray-900">تقييماتي</h3>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {userData.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {userData.reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{review.hotel.name}</h4>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">لم تقم بكتابة أي تقييمات بعد</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
