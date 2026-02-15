import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 'md',
  showValue = false,
}: StarRatingProps) {
  const value = Math.min(Math.max(0, rating), maxStars)
  const fullStars = Math.round(value)
  const emptyStars = maxStars - fullStars
  const iconClass = sizeClasses[size]

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className={`${iconClass} fill-yellow-400 text-yellow-400`}
        />
      ))}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${iconClass} text-gray-200`} />
      ))}
      {showValue && (
        <span className="mr-2 text-sm font-medium text-gray-700">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  )
}
