import { prisma } from '@/lib/prisma'
import SearchBar from '@/components/search/SearchBar'
import HotelCard from '@/components/hotel/HotelCard'
import { Star, Shield, Award, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getFeaturedHotels() {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        rooms: {
          orderBy: {
            pricePerNight: 'asc',
          },
          take: 1,
        },
        reviews: true,
      },
      orderBy: {
        stars: 'desc',
      },
      take: 6,
    })

    return hotels.map((hotel) => ({
    ...hotel,
    images: JSON.parse(hotel.images) as string[],
    amenities: JSON.parse(hotel.amenities) as string[],
    minPrice: hotel.rooms[0]?.pricePerNight || 0,
    reviewCount: hotel.reviews.length,
    averageRating:
      hotel.reviews.length > 0
        ? hotel.reviews.reduce((acc, review) => acc + review.rating, 0) / hotel.reviews.length
        : 0,
  }))
  } catch {
    return []
  }
}

export default async function Home() {
  const featuredHotels = await getFeaturedHotels()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-600 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              اكتشف أفضل الفنادق في العالم
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              احجز فندقك المثالي بأفضل الأسعار
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-6xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">أفضل الأسعار</h3>
              <p className="text-gray-600">نضمن لك أفضل الأسعار المتاحة</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">حجز آمن</h3>
              <p className="text-gray-600">نظام دفع آمن ومضمون 100%</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">فنادق مميزة</h3>
              <p className="text-gray-600">مئات الفنادق المتميزة في انتظارك</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">خدمة ممتازة</h3>
              <p className="text-gray-600">دعم فني متاح على مدار الساعة</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              الفنادق المميزة
            </h2>
            <p className="text-xl text-gray-600">
              اختر من بين أفضل الفنادق المتاحة
            </p>
          </div>

          {featuredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  id={hotel.id}
                  name={hotel.name}
                  description={hotel.description}
                  city={hotel.city}
                  country={hotel.country}
                  stars={hotel.stars}
                  images={hotel.images}
                  minPrice={hotel.minPrice}
                  reviewCount={hotel.reviewCount}
                  averageRating={hotel.averageRating}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">لا توجد فنادق متاحة حالياً</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            جاهز لحجز رحلتك القادمة؟
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            انضم إلى آلاف المسافرين السعداء
          </p>
          <a
            href="/search"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors"
          >
            ابدأ البحث الآن
          </a>
        </div>
      </section>
    </div>
  )
}
