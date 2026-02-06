import { User, Hotel, Room, Booking, Review } from '@prisma/client'

// أنواع الفندق مع علاقاته
export type HotelWithRelations = Hotel & {
  rooms: Room[]
  reviews: Review[]
  _count?: {
    reviews: number
    bookings: number
  }
}

// أنواع الحجز مع علاقاته
export type BookingWithRelations = Booking & {
  user: User
  hotel: Hotel
  room: Room
}

// أنواع البحث
export interface SearchParams {
  city?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  minPrice?: number
  maxPrice?: number
  stars?: number
}

// أنواع الفلاتر
export interface FilterOptions {
  priceRange: [number, number]
  stars: number[]
  amenities: string[]
}
