"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
  max?: number
}

export function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  return (
    <div className="flex">
      {[...Array(max)].map((_, i) => {
        const ratingValue = i + 1
        return (
          <Star
            key={i}
            className={`h-6 w-6 cursor-pointer transition-colors ${
              ratingValue <= (hoverValue || value) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
            onMouseEnter={() => setHoverValue(ratingValue)}
            onMouseLeave={() => setHoverValue(null)}
            onClick={() => onChange(ratingValue)}
          />
        )
      })}
    </div>
  )
}
