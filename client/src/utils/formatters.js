// Format date to readable string
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format date and time
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Format time elapsed
export const formatTimeElapsed = (startDate, endDate) => {
  const diffMs = new Date(endDate) - new Date(startDate);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`;
  if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m`;
  return `${diffMins}m`;
};

// Format execution time
export const formatExecutionTime = (milliseconds) => {
  if (milliseconds < 1000) return `${milliseconds}ms`;
  return `${(milliseconds / 1000).toFixed(2)}s`;
};

// Format memory usage
export const formatMemory = (bytes) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

// Format problem difficulty with color
export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: "text-green-500",
    medium: "text-yellow-500",
    hard: "text-red-500",
  };
  return colors[difficulty] || "text-gray-500";
};

// Format problem difficulty badge
export const getDifficultyBadge = (difficulty) => {
  const badges = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };
  return badges[difficulty] || "bg-gray-100 text-gray-800";
};

// Format status with color
export const getStatusColor = (status) => {
  const colors = {
    accepted: "text-green-500",
    rejected: "text-red-500",
    pending: "text-blue-500",
    running: "text-purple-500",
    "time-limit": "text-red-600",
    "memory-limit": "text-red-600",
  };
  return colors[status] || "text-gray-500";
};

// Format number with commas
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format percentage
export const formatPercentage = (value, precision = 2) => {
  return (value * 100).toFixed(precision) + "%";
};

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

// Highlight code
export const highlightCode = (code, language) => {
  // This would integrate with a syntax highlighting library like Highlight.js
  return code;
};

// Format contest status
export const getContestStatus = (startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) return "upcoming";
  if (now > end) return "ended";
  return "live";
};

// Format user role
export const formatUserRole = (role) => {
  const roles = {
    user: "User",
    admin: "Admin",
    moderator: "Moderator",
  };
  return roles[role] || role;
};

// Truncate middle of string
export const truncateMiddle = (str, maxLength = 20) => {
  if (str.length <= maxLength) return str;
  const half = Math.floor((maxLength - 3) / 2);
  return str.substring(0, half) + "..." + str.substring(str.length - half);
};
