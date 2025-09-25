/**
 * Утилиты для работы с датами
 * Обеспечивают безопасную работу с датами как Date объектами, так и строками
 */

export const safeDate = (date: Date | string | undefined): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return date;
  try {
    return new Date(date);
  } catch {
    return null;
  }
};

export const getTimeDiff = (startDate: Date | string | undefined, endDate: Date | string | undefined = new Date()): number => {
  const start = safeDate(startDate);
  const end = safeDate(endDate);
  
  if (!start || !end) return 0;
  
  return Math.floor((end.getTime() - start.getTime()) / 1000 / 60); // в минутах
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} мин`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ч`;
  }
  
  return `${hours} ч ${remainingMinutes} мин`;
};

export const isToday = (date: Date | string | undefined): boolean => {
  const targetDate = safeDate(date);
  if (!targetDate) return false;
  
  const today = new Date();
  return targetDate.toDateString() === today.toDateString();
};

export const isSameDay = (date1: Date | string | undefined, date2: Date | string | undefined): boolean => {
  const d1 = safeDate(date1);
  const d2 = safeDate(date2);
  
  if (!d1 || !d2) return false;
  
  return d1.toDateString() === d2.toDateString();
};
