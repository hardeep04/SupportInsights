/**
 * Safe localStorage wrapper that never throws
 * Handles all error cases: disabled, full, quota exceeded, etc.
 */

export class SafeStorage {
  /**
   * Safely get item from localStorage
   * @returns data if successful, null if any error
   */
  static getItem(key: string): string | null {
    try {
      // First check if localStorage is available
      if (!this.isAvailable()) {
        return null;
      }
      return localStorage.getItem(key);
    } catch (error) {
      // localStorage is disabled, private mode, quota exceeded, etc.
      console.warn(`SafeStorage error reading '${key}':`, error);
      return null;
    }
  }

  /**
   * Safely get and parse JSON from localStorage
   * @returns parsed object if successful, fallback value if any error
   */
  static getJSON<T>(key: string, fallback: T | null): T | null {
    try {
      if (!this.isAvailable()) {
        return fallback;
      }
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item);
    } catch (error) {
      // Parse error, disabled, quota, etc.
      console.warn(`SafeStorage error reading JSON '${key}':`, error);
      return fallback;
    }
  }

  /**
   * Safely set item in localStorage
   * @returns true if successful, false if any error
   */
  static setItem(key: string, value: string): boolean {
    try {
      if (!this.isAvailable()) {
        return false;
      }
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      // localStorage is disabled, private mode, quota exceeded, etc.
      console.warn(`SafeStorage error writing '${key}':`, error);
      return false;
    }
  }

  /**
   * Safely set JSON in localStorage
   * @returns true if successful, false if any error
   */
  static setJSON(key: string, value: unknown): boolean {
    try {
      if (!this.isAvailable()) {
        return false;
      }
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      // localStorage is disabled, private mode, quota exceeded, etc.
      console.warn(`SafeStorage error writing JSON '${key}':`, error);
      return false;
    }
  }

  /**
   * Safely remove item from localStorage
   * @returns true if successful, false if any error
   */
  static removeItem(key: string): boolean {
    try {
      if (!this.isAvailable()) {
        return false;
      }
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`SafeStorage error removing '${key}':`, error);
      return false;
    }
  }

  /**
   * Check if localStorage is available and working
   */
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}
