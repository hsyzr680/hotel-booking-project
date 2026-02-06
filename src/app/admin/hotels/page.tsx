import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Hotel, Plus, MapPin, Star, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

async function getHotels() {
  const hotels = await prisma.hotel.findMany({
    include: {
      rooms: true,
      reviews: true,
      bookings: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return hotels.map((hotel) => ({
    ...hotel,
    images: JSON.parse(hotel.images) as string[],
    amenities: JSON.parse(hotel.amenities) as string[],
  }))
}

export default async function AdminHotelsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login')
  }

  const hotels = await getHotels()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الفنادق</h1>
            <p className="text-gray-600">عرض وإدارة جميع الفنادق</p>
          </div>
          <Link href="/admin/hotels/new">
            <Button>
              <Plus className="w-5 h-5 ml-2" />
              إضافة فندق جديد
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">إجمالي الفنادق</p>
                  <p className="text-3xl font-bold text-gray-900">{hotels.length}</p>
                </div>
                <Hotel className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">إجمالي الغرف</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {hotels.reduce((acc, hotel) => acc + hotel.rooms.length, 0)}
                  </p>
                </div>
                <Hotel className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">إجمالي الحجوزات</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {hotels.reduce((acc, hotel) => acc + hotel.bookings.length, 0)}
                  </p>
                </div>
                <Hotel className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hotels List */}
        <div className="grid grid-cols-1 gap-6">
          {hotels.map((hotel) => (
            <Card key={hotel.id} hover>
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-64 h-48 flex-shrink-0">
                  <Image
                    src={hotel.images[0] || '/placeholder.jpg'}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                    sizes="256px"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{hotel.city}, {hotel.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: hotel.stars }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/hotels/${hotel.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 ml-1" />
                          تعديل
                        </Button>
                      </Link>
                      <Button variant="danger" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {hotel.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">الغرف</p>
                      <p className="text-lg font-semibold text-gray-900">{hotel.rooms.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">التقييمات</p>
                      <p className="text-lg font-semibold text-gray-900">{hotel.reviews.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">الحجوزات</p>
                      <p className="text-lg font-semibold text-gray-900">{hotel.bookings.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {hotels.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Hotel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-4">لا توجد فنادق مسجلة</p>
                <Link href="/admin/hotels/new">
                  <Button>
                    <Plus className="w-5 h-5 ml-2" />
                    إضافة أول فندق
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
