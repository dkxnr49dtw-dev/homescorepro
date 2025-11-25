import { useState } from 'react';
import './PropertyImage.css';

/**
 * Placeholder images by property type
 * These would ideally be actual images, but for the prototype we use emojis/icons
 */
const PROPERTY_ICONS = {
  house: '🏡',
  unit: '🏢',
  apartment: '🏢',
  townhouse: '🏠',
  villa: '🏘️',
  default: '🏡'
};

/**
 * PropertyImage Component
 * Displays property images with fallback placeholders
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL (optional)
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.propertyType - Type of property: 'house' | 'unit' | 'townhouse' | etc.
 * @param {string} props.suburb - Suburb name (used for consistent placeholder selection)
 * @param {string} props.className - Additional CSS classes
 */
export function PropertyImage({ 
  src, 
  alt, 
  propertyType = 'house',
  suburb,
  className = ''
}) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // Get icon for property type
  const getPropertyIcon = () => {
    const type = propertyType?.toLowerCase() || 'default';
    return PROPERTY_ICONS[type] || PROPERTY_ICONS.default;
  };
  
  // If no image or error loading, show placeholder
  if (!src || error) {
    return (
      <div className={`property-image-container property-image-placeholder ${className}`}>
        <div className="property-image-placeholder__icon">
          {getPropertyIcon()}
        </div>
        <span className="sr-only">{alt || `${propertyType} property image placeholder`}</span>
      </div>
    );
  }
  
  return (
    <div className={`property-image-container ${className}`}>
      {!loaded && (
        <div className="property-image-skeleton">
          <div className="property-image-skeleton__icon">{getPropertyIcon()}</div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`property-image ${loaded ? 'property-image--loaded' : ''}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}

/**
 * PropertyMapPreview Component
 * Shows a static map preview of the property location
 * Note: Requires Mapbox or Google Maps API key in production
 * 
 * @param {Object} props
 * @param {number} props.lat - Latitude
 * @param {number} props.lng - Longitude
 * @param {string} props.suburb - Suburb name
 * @param {string} props.postcode - Postcode
 * @param {string} props.className - Additional CSS classes
 */
export function PropertyMapPreview({ 
  lat, 
  lng, 
  suburb, 
  postcode,
  className = '' 
}) {
  // For the prototype, we show a placeholder map view
  // In production, this would use Mapbox or Google Maps Static API
  const hasCoordinates = lat && lng;
  
  return (
    <div className={`property-map-preview ${className}`}>
      <div className="property-map-preview__placeholder">
        <span className="property-map-preview__icon">🗺️</span>
        <div className="property-map-preview__overlay">
          <span className="property-map-preview__suburb">{suburb}</span>
          {postcode && <span className="property-map-preview__postcode">{postcode}</span>}
        </div>
        {hasCoordinates && (
          <span className="property-map-preview__coords">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * PropertyCard Component with image/map toggle
 * Enhanced property card that can switch between photo and map views
 * 
 * @param {Object} props
 * @param {Object} props.property - Property data object
 */
export function PropertyCardImage({ property }) {
  const [viewMode, setViewMode] = useState('photo'); // 'photo' | 'map'
  
  return (
    <div className="property-card__image-container">
      {viewMode === 'photo' ? (
        <PropertyImage
          src={property.imageUrl}
          propertyType={property.type}
          suburb={property.suburb}
          alt={`${property.address}, ${property.suburb}`}
        />
      ) : (
        <PropertyMapPreview
          lat={property.latitude}
          lng={property.longitude}
          suburb={property.suburb}
          postcode={property.postcode}
        />
      )}
      
      {/* View toggle */}
      <div className="property-card__view-toggle">
        <button
          className={`view-toggle-btn ${viewMode === 'photo' ? 'view-toggle-btn--active' : ''}`}
          onClick={() => setViewMode('photo')}
          aria-pressed={viewMode === 'photo'}
          aria-label="View property photo"
        >
          📷
        </button>
        <button
          className={`view-toggle-btn ${viewMode === 'map' ? 'view-toggle-btn--active' : ''}`}
          onClick={() => setViewMode('map')}
          aria-pressed={viewMode === 'map'}
          aria-label="View property location on map"
        >
          🗺️
        </button>
      </div>
    </div>
  );
}

export default PropertyImage;
