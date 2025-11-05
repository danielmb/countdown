// I am bad at math
export const seconds = (sec: number) => sec * 1000;
export const minutes = (min: number) => seconds(min * 60);
export const hours = (hrs: number) => minutes(hrs * 60);
export const days = (days: number) => hours(days * 24);

// convert milliseconds to a human-readable format
export const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(' ');
};
