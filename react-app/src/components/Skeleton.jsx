import { motion } from 'framer-motion'
import './Skeleton.css'

/**
 * Base skeleton component with shimmer animation
 * @param {Object} props
 * @param {string} props.width - CSS width value
 * @param {string} props.height - CSS height value
 * @param {string} props.variant - 'text' | 'circular' | 'rectangular' | 'card'
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
export function Skeleton({ 
  width = '100%', 
  height = '1rem', 
  variant = 'text',
  className = '',
  style = {}
}) {
  const baseClasses = `skeleton skeleton--${variant} ${className}`
  
  return (
    <motion.div
      className={baseClasses}
      style={{ width, height, ...style }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
      role="presentation"
    />
  )
}

/**
 * Skeleton text with multiple lines
 * @param {Object} props
 * @param {number} props.lines - Number of lines
 * @param {string} props.lastLineWidth - Width of the last line
 */
export function SkeletonText({ lines = 3, lastLineWidth = '60%' }) {
  return (
    <div className="skeleton-text">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i}
          variant="text"
          width={i === lines - 1 ? lastLineWidth : '100%'}
          height="1rem"
          style={{ marginBottom: i < lines - 1 ? '0.5rem' : 0 }}
        />
      ))}
    </div>
  )
}

/**
 * Circular skeleton for avatars/icons
 * @param {Object} props
 * @param {number} props.size - Size in pixels
 */
export function SkeletonCircle({ size = 48 }) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
    />
  )
}

/**
 * Score display skeleton
 */
export function ScoreDisplaySkeleton() {
  return (
    <div className="skeleton-score">
      {/* Label */}
      <Skeleton width="60%" height="0.875rem" style={{ margin: '0 auto' }} />
      
      {/* Large score number */}
      <Skeleton 
        width="150px" 
        height="6rem" 
        variant="rectangular"
        className="skeleton-score__value"
      />
      
      {/* Rating badge */}
      <Skeleton 
        width="200px" 
        height="3rem" 
        variant="rectangular"
        className="skeleton-score__rating"
        style={{ borderRadius: 'var(--radius-full)' }}
      />
      
      {/* Percentile text */}
      <Skeleton width="40%" height="0.8rem" style={{ margin: 'var(--space-4) auto 0' }} />
      
      {/* Description */}
      <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--glass-border)' }}>
        <Skeleton width="100%" height="0.875rem" />
        <Skeleton width="80%" height="0.875rem" style={{ marginTop: 'var(--space-2)' }} />
      </div>
    </div>
  )
}

/**
 * Breakdown section skeleton
 * @param {Object} props
 * @param {number} props.items - Number of breakdown items
 */
export function BreakdownSkeleton({ items = 7 }) {
  return (
    <div className="breakdown-skeleton">
      <Skeleton width="40%" height="1.25rem" style={{ marginBottom: 'var(--space-6)' }} />
      
      {Array.from({ length: items }).map((_, i) => (
        <div 
          key={i}
          className="breakdown-item-skeleton"
        >
          <div className="breakdown-item-skeleton__header">
            <div className="breakdown-item-skeleton__label">
              <Skeleton width="1.25rem" height="1.25rem" variant="circular" />
              <Skeleton width="120px" height="1rem" />
            </div>
            <Skeleton width="40px" height="1.25rem" />
          </div>
          <Skeleton width="100%" height="6px" style={{ borderRadius: 'var(--radius-full)' }} />
        </div>
      ))}
    </div>
  )
}

/**
 * Property card skeleton
 */
export function PropertyCardSkeleton() {
  return (
    <div className="skeleton-property-card">
      {/* Image placeholder */}
      <Skeleton 
        width="100%" 
        height="200px" 
        variant="rectangular"
        className="skeleton-property-card__image"
        style={{ borderRadius: 0 }}
      />
      
      {/* Content */}
      <div className="skeleton-property-card__content">
        {/* Location */}
        <Skeleton width="40%" height="0.875rem" />
        
        {/* Address */}
        <Skeleton width="70%" height="1.125rem" style={{ marginTop: 'var(--space-2)' }} />
        
        {/* Stats */}
        <div className="skeleton-property-card__stats">
          <div style={{ textAlign: 'center' }}>
            <Skeleton width="50px" height="0.75rem" style={{ margin: '0 auto' }} />
            <Skeleton width="40px" height="1.25rem" style={{ margin: 'var(--space-1) auto 0' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <Skeleton width="50px" height="0.75rem" style={{ margin: '0 auto' }} />
            <Skeleton width="40px" height="1.25rem" style={{ margin: 'var(--space-1) auto 0' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <Skeleton width="40px" height="0.75rem" style={{ margin: '0 auto' }} />
            <Skeleton width="50px" height="1.25rem" style={{ margin: 'var(--space-1) auto 0' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Calculator card skeleton
 */
export function CalculatorCardSkeleton() {
  return (
    <div className="skeleton-card">
      {/* Header */}
      <div className="skeleton-card__header">
        <Skeleton width="56px" height="56px" variant="rectangular" style={{ borderRadius: 'var(--radius-xl)' }} />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" height="1.5rem" />
          <Skeleton width="40%" height="0.875rem" style={{ marginTop: 'var(--space-2)' }} />
        </div>
      </div>
      
      {/* Form group */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Skeleton width="30%" height="0.875rem" style={{ marginBottom: 'var(--space-3)' }} />
        <Skeleton width="100%" height="52px" variant="rectangular" style={{ borderRadius: 'var(--radius-lg)' }} />
        <Skeleton width="80%" height="0.8rem" style={{ marginTop: 'var(--space-2)' }} />
      </div>
      
      {/* Button */}
      <Skeleton width="100%" height="48px" variant="rectangular" style={{ borderRadius: 'var(--radius-lg)' }} />
    </div>
  )
}

export default Skeleton
