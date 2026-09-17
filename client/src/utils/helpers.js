// Get user from localStorage
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Set user in localStorage
export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Clear user from localStorage
export const clearUser = () => {
  localStorage.removeItem("user");
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Set token in localStorage
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Clear token from localStorage
export const clearToken = () => {
  localStorage.removeItem("token");
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Merge objects
export const mergeObjects = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeObjects(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeObjects(target, ...sources);
};

// Check if value is object
export const isObject = (item) => {
  return item && typeof item === "object" && !Array.isArray(item);
};

// Get query param from URL
export const getQueryParam = (paramName) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName);
};

// Set query param in URL
export const setQueryParam = (paramName, paramValue) => {
  const params = new URLSearchParams(window.location.search);
  params.set(paramName, paramValue);
  window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
};

// Download file
export const downloadFile = (content, filename, type = "text/plain") => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
};

// Sleep function (promise)
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Retry function
export const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    await sleep(delay);
    return retry(fn, retries - 1, delay);
  }
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Format bytes to human readable
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

// Sort array of objects
export const sortBy = (array, key, order = "asc") => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === "asc" ? -1 : 1;
    if (a[key] > b[key]) return order === "asc" ? 1 : -1;
    return 0;
  });
};

// Filter unique items
export const unique = (array, key = null) => {
  if (!key) return [...new Set(array)];
  return array.reduce((unique, item) => {
    return unique.find((u) => u[key] === item[key]) ? unique : [...unique, item];
  }, []);
};
