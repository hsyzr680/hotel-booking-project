import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { MapPin, Star, Wifi, Car, Coffee, Dumbbell } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface HotelPageProps {
  params: {
    id: string
  }
}

async function getHotel(id: string) {
  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: {
      rooms: {
        orderBy: {
          pricePerNight: 'asc',
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
    },
  })

  if (!hotel) return null

  return {
    ...hotel,
    images: JSON.parse(hotel.images) as string[],
    amenities: JSON.parse(hotel.amenities) as string[],
    rooms: hotel.rooms.map((room) => ({
      ...room,
      images: JSON.parse(room.images) as string[],
      amenities: JSON.parse(room.amenities) as string[],
    })),
    averageRating:
      hotel.reviews.length > 0
        ? hotel.reviews.reduce((acc, review) => acc + review.rating, 0) / hotel.reviews.length
        : 0,
  }
}

const amenityIcons: Record<string, any> = {
  'واي فاي': Wifi,
  'موقف سيارات': Car,
  'مطعم': Coffee,
  'صالة رياضية': Dumbbell,
}

export default async function HotelPage({ params }: HotelPageProps) {
  const hotel = await getHotel(params.id)

  if (!hotel) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotel.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl ${
                  index === 0 ? 'md:col-span-2 md:row-span-2 h-96' : 'h-44'
                }`}
              >
                <Image
                  src={image}
                  alt={`${hotel.name} - صورة ${index + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Info */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {/* Title */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      {Array.from({ length: hotel.stars }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>
                        {hotel.address}, {hotel.city}, {hotel.country}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  {hotel.reviews.length > 0 && (
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xl font-bold">
                        {hotel.averageRating.toFixed(1)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">ممتاز</p>
                        <p className="text-sm text-gray-600">
                          {hotel.reviews.length} تقييم
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="mb-6 pb-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">عن الفندق</h2>
                    <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
                  </div>

                  {/* Amenities */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">المرافق والخدمات</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {hotel.amenities.map((amenity) => {
                        const Icon = amenityIcons[amenity] || Coffee
                        return (
                          <div key={amenity} className="flex items-center gap-2 text-gray-700">
                            <Icon className="w-5 h-5 text-blue-600" />
                            <span>{amenity}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rooms */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">الغرف المتاحة</h2>
                <div className="space-y-4">
                  {hotel.rooms.map((room) => (
                    <Card key={room.id}>
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-64 h-48 flex-shrink-0">
                          <Image
                            src={room.images[0] || hotel.images[0]}
                            alt={room.name}
                            fill
                            className="object-cover"
                            sizes="256px"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                          <p className="text-gray-600 mb-3">{room.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {room.amenities.slice(0, 4).map((amenity) => (
                              <span
                                key={amenity}
                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-gray-600">السعر لكل ليلة</span>
                              <div className="text-2xl font-bold text-blue-600">
                                {room.pricePerNight.toLocaleString('ar-SA')} ريال
                              </div>
                            </div>
                            <Link
                              href={`/booking?roomId=${room.id}&hotelId=${hotel.id}&hotelName=${encodeURIComponent(hotel.name)}&roomName=${encodeURIComponent(room.name)}&price=${room.pricePerNight}`}
                            >
                              <Button>احجز الآن</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              {hotel.reviews.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">التقييمات</h2>
                  <div className="space-y-4">
                    {hotel.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {review.user.name?.[0] || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {review.user.name || 'مستخدم'}
                                </h4>
                                <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-lg text-sm">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>{review.rating}</span>
                                </div>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                              <p className="text-sm text-gray-500 mt-2">
                                {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Booking Card */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">يبدأ من</span>
                    <div className="text-3xl font-bold text-blue-600">
                      {hotel.rooms[0]?.pricePerNight.toLocaleString('ar-SA')} ريال
                    </div>
                    <span className="text-sm text-gray-600">لكل ليلة</span>
                  </div>

                  <Link
                    href={`/booking?roomId=${hotel.rooms[0]?.id}&hotelId=${hotel.id}&hotelName=${encodeURIComponent(hotel.name)}&roomName=${encodeURIComponent(hotel.rooms[0]?.name || 'غرفة')}&price=${hotel.rooms[0]?.pricePerNight || 0}`}
                    className="block"
                  >
                    <Button size="lg" className="w-full mb-4">
                      احجز الآن
                    </Button>
                  </Link>

                  <div className="text-center text-sm text-gray-600">
                    <p>إلغاء مجاني</p>
                    <p className="mt-1">دفع آمن 100%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
