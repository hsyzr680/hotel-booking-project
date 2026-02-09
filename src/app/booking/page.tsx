'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, Users, CreditCard, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

function BookingContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  const roomId = searchParams.get('roomId')
  const hotelId = searchParams.get('hotelId')
  const hotelName = searchParams.get('hotelName')
  const roomName = searchParams.get('roomName')
  const price = searchParams.get('price')

  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?redirect=/booking')
    }
  }, [status, router])

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights : 0
  }

  const calculateTotal = () => {
    const nights = calculateNights()
    const pricePerNight = parseFloat(price || '0')
    return nights * pricePerNight
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          hotelId,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: formData.guests,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء الحجز')
      }

      setBookingDetails(data.booking)
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء الحجز')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (success && bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  تم الحجز بنجاح! 🎉
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  شكراً لك، تم تأكيد حجزك
                </p>

                <div className="bg-gray-50 rounded-lg p-6 text-right mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 text-center">تفاصيل الحجز</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">رقم الحجز:</span>
                      <span className="font-semibold text-gray-900">{bookingDetails.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الفندق:</span>
                      <span className="font-semibold text-gray-900">{bookingDetails.hotelName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الغرفة:</span>
                      <span className="font-semibold text-gray-900">{bookingDetails.roomName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ الدخول:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(bookingDetails.checkIn).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ الخروج:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(bookingDetails.checkOut).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">عدد الليالي:</span>
                      <span className="font-semibold text-gray-900">{bookingDetails.nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">عدد الضيوف:</span>
                      <span className="font-semibold text-gray-900">{bookingDetails.guests}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-gray-900 font-bold">المجموع:</span>
                      <span className="font-bold text-blue-600 text-xl">
                        {bookingDetails.totalPrice.toLocaleString('ar-SA')} ريال
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => router.push('/profile')}>
                    عرض حجوزاتي
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/')}>
                    العودة للرئيسية
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            إتمام الحجز
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="p-6">
                  <h2 className="text-xl font-bold text-gray-900">معلومات الحجز</h2>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Calendar className="absolute right-3 top-11 text-gray-400 w-5 h-5" />
                        <Input
                          label="تاريخ الدخول"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.checkIn}
                          onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                          required
                          className="pr-10"
                        />
                      </div>

                      <div className="relative">
                        <Calendar className="absolute right-3 top-11 text-gray-400 w-5 h-5" />
                        <Input
                          label="تاريخ الخروج"
                          type="date"
                          min={formData.checkIn || new Date().toISOString().split('T')[0]}
                          value={formData.checkOut}
                          onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                          required
                          className="pr-10"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <Users className="absolute right-3 top-11 text-gray-400 w-5 h-5" />
                      <Input
                        label="عدد الضيوف"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        required
                        className="pr-10"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      isLoading={isLoading}
                    >
                      <CreditCard className="w-5 h-5 ml-2" />
                      تأكيد الحجز
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">ملخص الحجز</h3>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">الفندق</p>
                      <p className="font-semibold text-gray-900">{hotelName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">الغرفة</p>
                      <p className="font-semibold text-gray-900">{roomName}</p>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">السعر لكل ليلة</span>
                        <span className="text-gray-900">{parseFloat(price || '0').toLocaleString('ar-SA')} ريال</span>
                      </div>
                      {calculateNights() > 0 && (
                        <>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">عدد الليالي</span>
                            <span className="text-gray-900">{calculateNights()}</span>
                          </div>
                          <div className="flex justify-between pt-3 border-t">
                            <span className="font-bold text-gray-900">المجموع</span>
                            <span className="font-bold text-blue-600 text-xl">
                              {calculateTotal().toLocaleString('ar-SA')} ريال
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  )
}
