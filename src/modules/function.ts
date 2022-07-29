/**
 * @description Add debounce to a function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(func: T, wait: number) => {
  let timeout: any = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      // null timeout to indicate the debounce ended
      timeout = null;
      // Execute the callback
      func(...args);
    };
    timeout && clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * @description Add throttle to a function
 */
export function throttle(fn: (...args: any[]) => any, wait: number) {
  let shouldWait = false;

  return function (...args: any) {
    if (!shouldWait) {
      fn(...args);
      shouldWait = true;
      setTimeout(() => (shouldWait = false), wait);
    }
  };
}
