'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Heart } from 'lucide-react'
import { Card } from '../ui/Card'
import Button from '../ui/Button'

interface HotelCardProps {
  id: string
  name: string
  description: string
  city: string
  country: string
  stars: number
  images: string[]
  minPrice: number
  reviewCount?: number
  averageRating?: number
}

export default function HotelCard({
  id,
  name,
  description,
  city,
  country,
  stars,
  images,
  minPrice,
  reviewCount = 0,
  averageRating = 0,
}: HotelCardProps) {
  const mainImage = images[0] || '/placeholder-hotel.jpg'

  return (
    <Card hover className="group">
      <Link href={`/hotel/${id}`} className="block">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={mainImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Favorite Button */}
          <button
            className="absolute top-3 left-3 bg-white/90 p-2 rounded-full hover:bg-white transition-colors z-10"
            onClick={(e) => {
              e.preventDefault()
              // TODO: Add to favorites
            }}
            aria-label="إضافة للمفضلة"
          >
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
          {/* Stars Badge */}
          <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Star className="w-4 h-4 fill-current" />
            <span>{stars} نجوم</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Hotel Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {city}, {country}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {description}
          </p>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                <Star className="w-3 h-3 fill-current" />
                <span>{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-600">
                ({reviewCount} تقييم)
              </span>
            </div>
          )}

          {/* Price and Book Button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <span className="text-sm text-gray-600">يبدأ من</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-blue-600">
                  {minPrice.toLocaleString('ar-SA')}
                </span>
                <span className="text-sm text-gray-600">ريال/ليلة</span>
              </div>
            </div>
            <Link
              href={`/hotel/${id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Button size="sm">
                احجز الآن
              </Button>
            </Link>
          </div>
        </div>
      </Link>
    </Card>
  )
}
