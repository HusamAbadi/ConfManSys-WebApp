export const epochToDate = (epoch) => new Date(epoch * 1000).toLocaleDateString(navigator.language, {
  weekday: 'short',  // Short form of the weekday
  month: 'short',    // Short form of the month
  day: '2-digit',     // Two-digit day
  year: '2-digit'
})

export const epochToTime = (epoch) => new Date(epoch * 1000).toLocaleTimeString(navigator.language, {
  hour: '2-digit',
  minute: '2-digit'
})

export const epochToDatetimeLocal = (epochTime) => {
  const date = new Date(epochTime * 1000); // Convert seconds to milliseconds
  const offset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
  const localDate = new Date(date.getTime() - offset); // Adjust to local time
  return localDate.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:mm"
};