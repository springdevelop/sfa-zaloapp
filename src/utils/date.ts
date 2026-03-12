import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format date to Vietnamese locale
 */
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: vi });
};

/**
 * Format date and time
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Format time only
 */
export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm');
};

/**
 * Get relative time (e.g., "2 giờ trước")
 */
export const getRelativeTime = (date: string | Date): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: vi });
};

/**
 * Calculate days remaining
 */
export const getDaysRemaining = (endDate: string | Date): number | null => {
  if (!endDate) return null;
  const dateObj = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInDays(dateObj, new Date());
};

/**
 * Format days remaining text
 */
export const formatDaysRemaining = (endDate: string | Date): string => {
  const days = getDaysRemaining(endDate);
  if (days === null) return '';
  if (days < 0) return 'Đã quá hạn';
  if (days === 0) return 'Hôm nay';
  if (days === 1) return 'Còn 1 ngày';
  return `Còn ${days} ngày`;
};

/**
 * Calculate duration in minutes
 */
export const calculateDuration = (startTime: string | Date, endTime: string | Date = new Date()): number => {
  const start = typeof startTime === 'string' ? parseISO(startTime) : startTime;
  const end = typeof endTime === 'string' ? parseISO(endTime) : endTime;
  return Math.floor((end.getTime() - start.getTime()) / 60000); // milliseconds to minutes
};

/**
 * Format duration (e.g., "1h 30m")
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};
