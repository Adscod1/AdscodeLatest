/**
 * Converts a date to a relative time string
 * @param date - The date to convert
 * @returns A string like "just now", "3 mins ago", "1 hr ago", "3 days ago", or the formatted date
 */
export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const timestamp = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

  // Just now (less than 1 minute)
  if (diffInSeconds < 60) {
    return 'just now';
  }

  // Minutes ago (1-59 minutes)
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'min' : 'mins'} ago`;
  }

  // Hours ago (1-23 hours)
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hr' : 'hrs'} ago`;
  }

  // Days ago (1-6 days)
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }

  // For older dates, return formatted date
  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: timestamp.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}
