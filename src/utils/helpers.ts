/**
 * Get status badge info based on visit target progress
 */
export const getStatusBadge = (actual: number, target: number) => {
  if (actual >= target) {
    return {
      text: 'Hoàn thành',
      className: 'badge-success',
    };
  }
  if (actual > 0) {
    return {
      text: 'Đang thực hiện',
      className: 'badge-warning',
    };
  }
  return {
    text: 'Chưa thăm',
    className: 'badge-gray',
  };
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (actual: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min((actual / target) * 100, 100);
};

/**
 * Get progress color
 */
export const getProgressColor = (percentage: number): string => {
  if (percentage >= 100) return '#00c851';
  if (percentage >= 50) return '#ffbb33';
  return '#ff4444';
};

/**
 * Format address (truncate if too long)
 */
export const formatAddress = (address: string, maxLength: number = 50): string => {
  if (!address || address.length <= maxLength) return address;
  return address.substring(0, maxLength) + '...';
};

/**
 * Validate check-in requirements
 */
export const validateCheckIn = (
  distance: number,
  maxDistance: number = 200
): { isValid: boolean; message: string } => {
  if (distance > maxDistance) {
    return {
      isValid: false,
      message: `Bạn cách quá xa khách hàng (${distance}m). Vui lòng đến gần hơn (< ${maxDistance}m).`,
    };
  }
  return {
    isValid: true,
    message: '',
  };
};

/**
 * Validate check-out requirements
 */
export const validateCheckOut = (
  duration: number,
  photos: string[],
  minDuration: number = 0.001, // Changed to 0.001 minutes (~60ms) for testing
  requirePhotos: boolean = true
): { isValid: boolean; message: string } => {
  if (duration < minDuration) {
    return {
      isValid: false,
      message: `Thời gian thăm quá ngắn (${duration} phút). Yêu cầu tối thiểu ${minDuration} phút.`,
    };
  }
  if (requirePhotos && (!photos || photos.length === 0)) {
    return {
      isValid: false,
      message: 'Vui lòng chụp ít nhất 1 ảnh minh chứng.',
    };
  }
  return {
    isValid: true,
    message: '',
  };
};
