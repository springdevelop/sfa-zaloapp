import { getLocation } from 'zmp-sdk';

interface Location {
  latitude: number;
  longitude: number;
}

// Mock location for development (Đà Nẵng)
const MOCK_LOCATION: Location = {
  latitude: 16.450744681143224,
  longitude: 107.5854334289142
};

/**
 * Get current GPS location from Zalo
 */
export const getCurrentLocation = async (): Promise<Location> => {
  console.log('🔍 Đang lấy vị trí GPS...');
  
  // Try Zalo SDK first
  try {
    const location = await getLocation({});
    console.log('📱 Zalo SDK location:', location);
    
    const lat = parseFloat(location.latitude as any);
    const lon = parseFloat(location.longitude as any);
    
    // Check if valid coordinates
    if (!isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
      console.log('✅ Zalo SDK location OK:', { latitude: lat, longitude: lon });
      return { latitude: lat, longitude: lon };
    }
    
    console.warn('⚠️ Zalo SDK trả về tọa độ không hợp lệ:', { lat, lon });
  } catch (error) {
    console.error('❌ Lỗi Zalo SDK:', error);
  }
  
  // Fallback to browser geolocation
  if (navigator.geolocation) {
    console.log('🌐 Thử browser geolocation...');
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      
      console.log('✅ Browser geolocation OK:', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (error) {
      console.error('❌ Browser geolocation thất bại:', error);
    }
  }
  
  // Final fallback: Use mock location for development
  console.warn('⚠️ Sử dụng MOCK LOCATION cho development:', MOCK_LOCATION);
  return MOCK_LOCATION;
};

/**
 * Calculate distance between two coordinates in meters
 * Using Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Validate if user is within allowed distance of customer location
 */
export const validateLocation = (
  userLat: number,
  userLon: number,
  customerLat: number,
  customerLon: number,
  maxDistance: number = 200
): { isValid: boolean; distance: number } => {
  const distance = calculateDistance(userLat, userLon, customerLat, customerLon);
  return {
    isValid: distance <= maxDistance,
    distance: Math.round(distance),
  };
};

/**
 * Format distance for display
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};
