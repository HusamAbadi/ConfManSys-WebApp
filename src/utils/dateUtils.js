/**
 * Utility functions for date manipulation in conference management
 */

/**
 * Generate an array of dates between start and end dates (inclusive)
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {Date[]} Array of dates between start and end dates
 */
export const generateDateRange = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

/**
 * Format a date to a consistent string representation
 * @param {Date} date - The date to format
 * @param {string} [format='short'] - The format type ('short', 'long', 'iso')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    case 'long':
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'iso':
      return date.toISOString().split('T')[0];
    default:
      return date.toString();
  }
};

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if dates are the same day, false otherwise
 */
export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Calculate the number of days between two dates
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {number} Number of days between dates (inclusive)
 */
export const daysBetween = (startDate, endDate) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.floor(timeDiff / millisecondsPerDay) + 1;
};

/**
 * Set a default time for a date (useful for conference day creation)
 * @param {Date} date - The date to set time for
 * @param {Object} [options] - Time setting options
 * @param {number} [options.hours=9] - Hours to set (default 9)
 * @param {number} [options.minutes=0] - Minutes to set (default 0)
 * @returns {Date} Date with specified time
 */
export const setDefaultTime = (date, options = {}) => {
  const { hours = 9, minutes = 0 } = options;
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

/**
 * Generate dates between start and end dates (including both start and end)
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {Date[]} Array of dates
 */
export const generateDatesBetween = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
