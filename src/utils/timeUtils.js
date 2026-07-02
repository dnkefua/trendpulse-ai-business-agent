// Utility function to compute dynamic relative post age matching external platform time
export const getRelativePostAge = (isoTimestamp) => {
  if (!isoTimestamp) return "Posted 15m ago";
  
  const postTime = new Date(isoTimestamp).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - postTime);

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `Posted ${diffMins}m ago`;
  if (diffHours < 24) return `Posted ${diffHours}h ago`;
  if (diffDays === 1) return "Posted 1d ago";
  return `Posted ${diffDays}d ago`;
};
