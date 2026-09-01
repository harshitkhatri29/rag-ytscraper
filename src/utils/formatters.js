/**
 * Formats a timestamp in seconds into a human-readable format MM:SS or HH:MM:SS.
 * @param {number} seconds
 * @returns {string}
 */
export function formatSeconds(seconds) {
  if (seconds == null || isNaN(seconds)) return '0:00';
  
  const totalSecs = Math.floor(seconds);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const paddedMins = hrs > 0 ? String(mins).padStart(2, '0') : String(mins);
  const paddedSecs = String(secs).padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${paddedMins}:${paddedSecs}`;
  }
  return `${paddedMins}:${paddedSecs}`;
}

/**
 * Formats a score (0 - 1.0 range) into a percentage representation.
 * @param {number} score
 * @returns {string}
 */
export function formatScore(score) {
  if (score == null || isNaN(score)) return '0%';
  const percentage = Math.round(score * 100);
  return `${percentage}% match`;
}
