import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LocalStorageHelper, createStorage } from '../src/index.js';

describe('LocalStorageHelper', () => {
  let storage;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    localStorage.clear();
    storage = new LocalStorageHelper({ prefix: 'test_' });
  });

  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it('creates instance with default options', () => {
    const s = new LocalStorageHelper();
    expect(s).toBeInstanceOf(LocalStorageHelper);
  });

  it('sets and gets values', () => {
    storage.set('key', 'value');
    expect(storage.get('key')).toBe('value');
  });

  it('handles objects', () => {
    const obj = { name: 'John', age: 30 };
    storage.set('user', obj);
    expect(storage.get('user')).toEqual(obj);
  });

  it('handles arrays', () => {
    const arr = [1, 2, 3, 4, 5];
    storage.set('numbers', arr);
    expect(storage.get('numbers')).toEqual(arr);
  });

  it('returns null for non-existent keys', () => {
    expect(storage.get('nonexistent')).toBeNull();
  });

  it('returns default value for non-existent keys', () => {
    expect(storage.get('nonexistent', 'default')).toBe('default');
  });

  it('removes values', () => {
    storage.set('key', 'value');
    storage.remove('key');
    expect(storage.get('key')).toBeNull();
  });

  it('has() returns correct boolean', () => {
    expect(storage.has('key')).toBe(false);
    storage.set('key', 'value');
    expect(storage.has('key')).toBe(true);
  });

  it('keys() returns all keys', () => {
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');
    storage.set('key3', 'value3');

    const keys = storage.keys();
    expect(keys).toHaveLength(3);
    expect(keys).toContain('key1');
    expect(keys).toContain('key2');
    expect(keys).toContain('key3');
  });

  it('clear() removes all prefixed keys', () => {
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');

    localStorage.setItem('other', 'value');

    storage.clear();

    expect(storage.keys()).toHaveLength(0);
    expect(localStorage.getItem('other')).toBe('value');
  });

  it('respects TTL', () => {
    storage.set('temp', 'value', 100);

    expect(storage.get('temp')).toBe('value');

    vi.advanceTimersByTime(150);

    expect(storage.get('temp')).toBeNull();
  });

  it('getTTL() returns remaining time', () => {
    storage.set('temp', 'value', 10000);

    const ttl = storage.getTTL('temp');
    expect(ttl).toBeGreaterThan(9000);
    expect(ttl).toBeLessThanOrEqual(10000);
  });

  it('getTTL() returns null for no TTL', () => {
    storage.set('permanent', 'value');
    expect(storage.getTTL('permanent')).toBeNull();
  });

  it('setTTL() updates expiration', () => {
    storage.set('key', 'value', 1000);
    storage.setTTL('key', 5000);

    const ttl = storage.getTTL('key');
    expect(ttl).toBeGreaterThan(4000);
  });

  it('getSize() returns size info', () => {
    storage.set('key1', 'short');
    storage.set('key2', 'a longer value');

    const size = storage.getSize();
    expect(size.items).toBe(2);
    expect(size.used).toBeGreaterThan(0);
  });

  it('uses prefix correctly', () => {
    storage.set('key', 'value');
    expect(localStorage.getItem('test_key')).not.toBeNull();
    expect(localStorage.getItem('key')).toBeNull();
  });

  it('createStorage() creates namespaced instance', () => {
    const userStorage = createStorage('user');
    userStorage.set('name', 'John');

    expect(localStorage.getItem('user_name')).not.toBeNull();
  });

  it('respects defaultTTL option', () => {
    const s = new LocalStorageHelper({ prefix: 'ttl_', defaultTTL: 100 });
    s.set('key', 'value');

    expect(s.get('key')).toBe('value');

    vi.advanceTimersByTime(150);

    expect(s.get('key')).toBeNull();
  });

  it('accepts a custom storage implementation', () => {
    const memory = new Map();
    const storageApi = {
      getItem: (key) => (memory.has(key) ? memory.get(key) : null),
      setItem: (key, value) => memory.set(key, value),
      removeItem: (key) => memory.delete(key),
      key: (index) => Array.from(memory.keys())[index] || null,
      get length() { return memory.size; },
      clear: () => memory.clear(),
    };

    const custom = new LocalStorageHelper({ storage: storageApi, prefix: 'mem_' });
    custom.set('alpha', 'value');

    expect(custom.get('alpha')).toBe('value');
    expect(memory.has('mem_alpha')).toBe(true);
  });
});
