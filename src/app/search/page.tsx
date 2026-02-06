import { prisma } from '@/lib/prisma'
import HotelCard from '@/components/hotel/HotelCard'
import SearchBar from '@/components/search/SearchBar'
import { Star } from 'lucide-react'

interface SearchPageProps {
  searchParams: {
    city?: string
    checkIn?: string
    checkOut?: string
    guests?: string
    stars?: string
    minPrice?: string
    maxPrice?: string
  }
}

async function searchHotels(searchParams: SearchPageProps['searchParams']) {
  const { city, stars, minPrice, maxPrice } = searchParams

  const hotels = await prisma.hotel.findMany({
    where: {
      ...(city && {
        OR: [
          { city: { contains: city } },
          { country: { contains: city } },
          { name: { contains: city } },
        ],
      }),
      ...(stars && { stars: parseInt(stars) }),
    },
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
      createdAt: 'desc',
    },
  })

  // Filter by price if specified
  let filteredHotels = hotels
  if (minPrice || maxPrice) {
    filteredHotels = hotels.filter((hotel) => {
      const price = hotel.rooms[0]?.pricePerNight || 0
      const min = minPrice ? parseFloat(minPrice) : 0
      const max = maxPrice ? parseFloat(maxPrice) : Infinity
      return price >= min && price <= max
    })
  }

  return filteredHotels.map((hotel) => ({
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
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const hotels = await searchHotels(searchParams)
  const { city, stars } = searchParams

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <section className="bg-blue-600 py-8">
        <div className="container mx-auto px-4">
          <SearchBar />
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">الفلاتر</h3>

                {/* Stars Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">تصنيف الفندق</h4>
                  <div className="space-y-2">
                    {[5, 4, 3].map((starCount) => (
                      <a
                        key={starCount}
                        href={`/search?${new URLSearchParams({
                          ...searchParams,
                          stars: starCount.toString(),
                        }).toString()}`}
                        className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                          stars === starCount.toString()
                            ? 'bg-blue-50 text-blue-600'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex">
                          {Array.from({ length: starCount }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm">{starCount} نجوم</span>
                      </a>
                    ))}
                    {stars && (
                      <a
                        href={`/search?${new URLSearchParams({
                          ...Object.fromEntries(
                            Object.entries(searchParams).filter(([key]) => key !== 'stars')
                          ),
                        }).toString()}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        إزالة الفلتر
                      </a>
                    )}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">السعر (ريال/ليلة)</h4>
                  <div className="space-y-2">
                    <a
                      href={`/search?${new URLSearchParams({
                        ...searchParams,
                        minPrice: '0',
                        maxPrice: '200',
                      }).toString()}`}
                      className="block p-2 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      أقل من 200
                    </a>
                    <a
                      href={`/search?${new URLSearchParams({
                        ...searchParams,
                        minPrice: '200',
                        maxPrice: '500',
                      }).toString()}`}
                      className="block p-2 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      200 - 500
                    </a>
                    <a
                      href={`/search?${new URLSearchParams({
                        ...searchParams,
                        minPrice: '500',
                        maxPrice: '1000',
                      }).toString()}`}
                      className="block p-2 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      500 - 1000
                    </a>
                    <a
                      href={`/search?${new URLSearchParams({
                        ...searchParams,
                        minPrice: '1000',
                      }).toString()}`}
                      className="block p-2 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      أكثر من 1000
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Hotels Grid */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {city ? `نتائج البحث في ${city}` : 'جميع الفنادق'}
                </h2>
                <p className="text-gray-600 mt-1">
                  وجدنا {hotels.length} فندق متاح
                </p>
              </div>

              {hotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {hotels.map((hotel) => (
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
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <p className="text-xl text-gray-600 mb-4">
                    لم نجد فنادق تطابق معايير البحث
                  </p>
                  <a
                    href="/search"
                    className="text-blue-600 hover:underline"
                  >
                    مسح الفلاتر وإظهار جميع الفنادق
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
