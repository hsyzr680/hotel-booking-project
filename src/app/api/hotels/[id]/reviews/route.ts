import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول لإضافة تقييم' },
        { status: 401 }
      )
    }

    const hotelId = params.id
    const body = await request.json()
    const { rating, comment } = body

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'التقييم يجب أن يكون بين 1 و 5 نجوم' },
        { status: 400 }
      )
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json(
        { error: 'التعليق مطلوب' },
        { status: 400 }
      )
    }

    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    })

    if (!hotel) {
      return NextResponse.json(
        { error: 'الفندق غير موجود' },
        { status: 404 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    const existing = await prisma.review.findFirst({
      where: { userId: user.id, hotelId },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'لديك تقييم سابق لهذا الفندق. يمكنك تعديله من صفحة حسابك.' },
        { status: 400 }
      )
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        hotelId,
        rating: Math.round(rating),
        comment: comment.trim().slice(0, 2000),
      },
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('Review API error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إضافة التقييم' },
      { status: 500 }
    )
  }
}
