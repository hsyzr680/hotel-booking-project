import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// منع Next.js من محاولة pre-render هذا Route
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { roomId, hotelId, checkIn, checkOut, guests } = body

    if (!roomId || !hotelId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // Get room details
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    })

    if (!room) {
      return NextResponse.json(
        { error: 'الغرفة غير موجودة' },
        { status: 404 }
      )
    }

    // Calculate nights and total price
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (nights <= 0) {
      return NextResponse.json(
        { error: 'تاريخ الخروج يجب أن يكون بعد تاريخ الدخول' },
        { status: 400 }
      )
    }

    const totalPrice = room.pricePerNight * nights

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        hotelId,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: parseInt(guests),
        totalPrice,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
      },
      include: {
        hotel: true,
        room: true,
      },
    })

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        hotelName: booking.hotel.name,
        roomName: booking.room.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        nights,
        totalPrice: booking.totalPrice,
      },
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الحجز' },
      { status: 500 }
    )
  }
}
