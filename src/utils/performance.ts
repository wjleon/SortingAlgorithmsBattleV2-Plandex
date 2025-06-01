/**
 * Utility functions for performance optimizations
 */

// Check if code is running in browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Throttle a function to limit how often it can be called
 * @param func The function to throttle
 * @param limit The time limit in milliseconds
 * @returns A throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => ReturnType<T> | undefined) => {
  let lastCall = 0;
  let lastResult: ReturnType<T>;
  
  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      lastResult = func(...args);
      return lastResult;
    }
    return lastResult;
  };
};

/**
 * Debounce a function to delay its execution until after a specified time
 * @param func The function to debounce
 * @param wait The time to wait in milliseconds
 * @returns A debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>): void => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Chunk an array into smaller arrays of a specified size
 * Useful for processing large arrays in smaller batches
 * @param array The array to chunk
 * @param size The size of each chunk
 * @returns An array of chunks
 */
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Calculate the optimal chunk size based on array length
 * @param arrayLength The length of the array
 * @returns The optimal chunk size
 */
export const calculateOptimalChunkSize = (arrayLength: number): number => {
  // For very small arrays, no chunking needed
  if (arrayLength < 100) return arrayLength;
  
  // For medium arrays, use smaller chunks
  if (arrayLength < 500) return 50;
  
  // For large arrays, use larger chunks
  if (arrayLength < 1000) return 100;
  
  // For very large arrays, use even larger chunks
  return 200;
};

/**
 * Determine if the browser is running on a mobile device
 * @returns True if the browser is running on a mobile device
 */
export const isMobileDevice = (): boolean => {
  if (!isBrowser) return false;
  
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  } catch (error) {
    console.error('Error checking mobile device:', error);
    return false;
  }
};

/**
 * Determine if the browser supports the Web Animation API
 * @returns True if the browser supports the Web Animation API
 */
export const supportsWebAnimations = (): boolean => {
  if (!isBrowser) return false;
  
  try {
    return typeof Element !== 'undefined' && 'animate' in Element.prototype;
  } catch (error) {
    console.error('Error checking Web Animation API support:', error);
    return false;
  }
};

/**
 * Determine if the browser supports the ResizeObserver API
 * @returns True if the browser supports the ResizeObserver API
 */
export const supportsResizeObserver = (): boolean => {
  if (!isBrowser) return false;
  
  try {
    return typeof ResizeObserver !== 'undefined';
  } catch (error) {
    console.error('Error checking ResizeObserver support:', error);
    return false;
  }
};

/**
 * Determine if the browser supports the IntersectionObserver API
 * @returns True if the browser supports the IntersectionObserver API
 */
export const supportsIntersectionObserver = (): boolean => {
  if (!isBrowser) return false;
  
  try {
    return typeof IntersectionObserver !== 'undefined';
  } catch (error) {
    console.error('Error checking IntersectionObserver support:', error);
    return false;
  }
};

/**
 * Determine if the browser supports passive event listeners
 * @returns True if the browser supports passive event listeners
 */
export const supportsPassiveEvents = (): boolean => {
  if (!isBrowser) return false;
  
  let supportsPassive = false;
  try {
    // Test via a getter in the options object to see if the passive property is accessed
    const opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
        return true;
      }
    });
    window.addEventListener('testPassive', null as any, opts);
    window.removeEventListener('testPassive', null as any, opts);
  } catch (e) {
    // Do nothing
  }
  return supportsPassive;
};
