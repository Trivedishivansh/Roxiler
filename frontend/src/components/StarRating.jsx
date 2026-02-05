import { Star } from 'lucide-react'

const StarRating = ({ rating, maxStars = 5, interactive = false, onRate, size = 20 }) => {
  const handleClick = (index) => {
    if (interactive && onRate) {
      onRate(index + 1)
    }
  }

  return (
    <div className="flex space-x-1">
      {[...Array(maxStars)].map((_, index) => (
        <Star
          key={index}
          size={size}
          onClick={() => handleClick(index)}
          className={`${
            index < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        />
      ))}
    </div>
  )
}

export default StarRating