'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface ReviewFormProps {
  hotelId: string
  onSuccess?: () => void
}

export default function ReviewForm({ hotelId, onSuccess }: ReviewFormProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const displayStars = hoverRating || rating

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (rating < 1 || rating > 5) {
      setError('اختر عدد النجوم من 1 إلى 5')
      return
    }
    if (!comment.trim()) {
      setError('اكتب تعليقك')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/hotels/${hotelId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment: comment.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'حدث خطأ')
        return
      }
      setSuccess(true)
      setRating(0)
      setComment('')
      onSuccess?.()
      router.refresh()
    } catch {
      setError('حدث خطأ في الإرسال')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return null
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600 mb-3">سجّل دخولك لإضافة تقييم لهذا الفندق.</p>
          <Link href={`/auth/login?redirect=/hotel/${hotelId}`}>
            <Button variant="outline" size="sm">
              تسجيل الدخول
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (success) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-green-600 font-medium">تم إرسال تقييمك بنجاح. شكراً لك!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">أضف تقييمك</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التقييم (1–5 نجوم)
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label={`${star} نجوم`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= displayStars
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التعليق
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="اكتب تجربتك في هذا الفندق..."
              maxLength={2000}
            />
            <p className="text-xs text-gray-500 mt-1">{comment.length}/2000</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'جاري الإرسال...' : 'إرسال التقييم'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
