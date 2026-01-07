export interface StorageOptions {
  /** Prefix for all keys */
  prefix?: string;
  /** Default TTL in milliseconds (0 = no expiration) */
  defaultTTL?: number;
  /** Use sessionStorage instead of localStorage */
  useSession?: boolean;
}

export interface StorageItem<T> {
  value: T;
  expiry: number | null;
  createdAt: number;
}

export declare class LocalStorageHelper {
  constructor(options?: StorageOptions);

  /**
   * Set a value with optional TTL
   * @param key - Storage key
   * @param value - Value to store (will be JSON serialized)
   * @param ttl - Time to live in milliseconds (overrides default)
   */
  set<T>(key: string, value: T, ttl?: number): void;

  /**
   * Get a value (returns null if expired or not found)
   * @param key - Storage key
   * @param defaultValue - Default value if not found
   */
  get<T>(key: string, defaultValue?: T): T | null;

  /**
   * Remove a value
   * @param key - Storage key
   */
  remove(key: string): void;

  /**
   * Check if key exists and is not expired
   * @param key - Storage key
   */
  has(key: string): boolean;

  /**
   * Clear all items with the configured prefix
   */
  clear(): void;

  /**
   * Get all keys with the configured prefix
   */
  keys(): string[];

  /**
   * Get remaining TTL for a key in milliseconds
   * @param key - Storage key
   * @returns Remaining TTL or null if no expiration/not found
   */
  getTTL(key: string): number | null;

  /**
   * Update TTL for existing key
   * @param key - Storage key
   * @param ttl - New TTL in milliseconds
   */
  setTTL(key: string, ttl: number): boolean;

  /**
   * Get storage size info
   */
  getSize(): { used: number; available: number; items: number };
}

/**
 * Create a namespaced storage instance
 * @param namespace - Storage namespace/prefix
 * @param options - Storage options
 */
export declare function createStorage(
  namespace: string,
  options?: Omit<StorageOptions, 'prefix'>
): LocalStorageHelper;
