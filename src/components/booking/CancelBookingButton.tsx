'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

interface CancelBookingButtonProps {
  bookingId: string
  status: string
}

export default function CancelBookingButton({ bookingId, status }: CancelBookingButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (status === 'CANCELLED' || status === 'COMPLETED') {
    return null
  }

  const handleCancel = async () => {
    if (!confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) return
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'فشل الإلغاء')
        return
      }
      router.refresh()
    } catch {
      setError('حدث خطأ')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCancel}
        disabled={isLoading}
        className="text-red-600 border-red-200 hover:bg-red-50"
      >
        <XCircle className="w-4 h-4 ml-1" />
        {isLoading ? 'جاري الإلغاء...' : 'إلغاء الحجز'}
      </Button>
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </div>
  )
}
