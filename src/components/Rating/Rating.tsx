import { cn } from '../../utils/helpers.js';
import { Icon } from '../Icon/Icon.js';
import './Rating.css';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function Rating({ value, max = 5, size = 'md', showValue = false, className }: RatingProps) {
  return (
    <div className={cn('rating', `rating--${size}`, className)}>
      <div className="rating__stars" role="img" aria-label={`${value} de ${max} estrellas`}>
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={cn('rating__star', i < value && 'rating__star--filled')}
          >
            <Icon name="star" size={size} />
          </span>
        ))}
      </div>
      {showValue && (
        <span className="rating__value">
          {value}/{max}
        </span>
      )}
    </div>
  );
}
