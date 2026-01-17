import { describe, it, expect } from 'vitest';
import {
  UrlParams,
  toQueryString,
  parseQueryString,
} from '../src/index.js';

describe('UrlParams', () => {
  it('creates instance from URL string', () => {
    const params = new UrlParams('https://example.com?a=1&b=2');
    expect(params.get('a')).toBe('1');
    expect(params.get('b')).toBe('2');
  });

  it('get() returns null for missing key', () => {
    const params = new UrlParams('https://example.com');
    expect(params.get('missing')).toBeNull();
  });

  it('get() returns default value for missing key', () => {
    const params = new UrlParams('https://example.com');
    expect(params.get('missing', 'default')).toBe('default');
  });

  it('set() adds new parameter', () => {
    const params = new UrlParams('https://example.com');
    params.set('key', 'value');
    expect(params.get('key')).toBe('value');
  });

  it('set() updates existing parameter', () => {
    const params = new UrlParams('https://example.com?key=old');
    params.set('key', 'new');
    expect(params.get('key')).toBe('new');
  });

  it('set() with null removes parameter', () => {
    const params = new UrlParams('https://example.com?key=value');
    params.set('key', null);
    expect(params.has('key')).toBe(false);
  });

  it('set() handles arrays (repeat)', () => {
    const params = new UrlParams('https://example.com');
    params.set('tags', ['a', 'b', 'c']);
    expect(params.getAll('tags')).toEqual(['a', 'b', 'c']);
  });

  it('set() handles arrays (bracket)', () => {
    const params = new UrlParams('https://example.com', { arrayFormat: 'bracket' });
    params.set('tags', ['a', 'b']);
    expect(params.getAll('tags[]')).toEqual(['a', 'b']);
    expect(params.getObject().tags).toEqual(['a', 'b']);
  });

  it('set() handles arrays (index)', () => {
    const params = new UrlParams('https://example.com', { arrayFormat: 'index' });
    params.set('tags', ['a', 'b']);
    expect(params.getAll('tags[0]')).toEqual(['a']);
    expect(params.getObject().tags).toEqual(['a', 'b']);
  });

  it('set() handles arrays (comma)', () => {
    const params = new UrlParams('https://example.com', { arrayFormat: 'comma' });
    params.set('tags', ['a', 'b']);
    expect(params.get('tags')).toBe('a,b');
  });

  it('setAll() sets multiple parameters', () => {
    const params = new UrlParams('https://example.com');
    params.setAll({ a: 1, b: 2, c: 3 });
    expect(params.get('a')).toBe('1');
    expect(params.get('b')).toBe('2');
    expect(params.get('c')).toBe('3');
  });

  it('append() adds to existing values', () => {
    const params = new UrlParams('https://example.com?tag=a');
    params.append('tag', 'b');
    expect(params.getAll('tag')).toEqual(['a', 'b']);
  });

  it('remove() deletes parameter', () => {
    const params = new UrlParams('https://example.com?a=1&b=2');
    params.remove('a');
    expect(params.has('a')).toBe(false);
    expect(params.has('b')).toBe(true);
  });

  it('has() returns correct boolean', () => {
    const params = new UrlParams('https://example.com?exists=1');
    expect(params.has('exists')).toBe(true);
    expect(params.has('missing')).toBe(false);
  });

  it('clear() removes all parameters', () => {
    const params = new UrlParams('https://example.com?a=1&b=2&c=3');
    params.clear();
    expect(params.toString()).toBe('');
  });

  it('getObject() returns all params as object', () => {
    const params = new UrlParams('https://example.com?a=1&b=2');
    const obj = params.getObject();
    expect(obj).toEqual({ a: '1', b: '2' });
  });

  it('getObject() handles arrays', () => {
    const params = new UrlParams('https://example.com?tag=a&tag=b');
    const obj = params.getObject();
    expect(obj.tag).toEqual(['a', 'b']);
  });

  it('toString() returns query string', () => {
    const params = new UrlParams('https://example.com?a=1&b=2');
    expect(params.toString()).toBe('?a=1&b=2');
  });

  it('toString() returns empty for no params', () => {
    const params = new UrlParams('https://example.com');
    expect(params.toString()).toBe('');
  });

  it('toURL() returns full URL', () => {
    const params = new UrlParams('https://example.com?a=1');
    params.set('b', 2);
    expect(params.toURL()).toContain('example.com');
    expect(params.toURL()).toContain('a=1');
    expect(params.toURL()).toContain('b=2');
  });

  it('supports method chaining', () => {
    const params = new UrlParams('https://example.com');
    const result = params.set('a', 1).set('b', 2).remove('a').toString();
    expect(result).toBe('?b=2');
  });
});

describe('toQueryString', () => {
  it('converts object to query string', () => {
    const qs = toQueryString({ a: 1, b: 'hello' });
    expect(qs).toBe('?a=1&b=hello');
  });

  it('handles empty object', () => {
    const qs = toQueryString({});
    expect(qs).toBe('');
  });

  it('handles null/undefined values', () => {
    const qs = toQueryString({ a: 1, b: null, c: undefined });
    expect(qs).toBe('?a=1');
  });

  it('handles arrays with repeat format', () => {
    const qs = toQueryString({ ids: [1, 2, 3] }, { arrayFormat: 'repeat' });
    expect(qs).toBe('?ids=1&ids=2&ids=3');
  });

  it('handles arrays with bracket format', () => {
    const qs = toQueryString({ ids: [1, 2] }, { arrayFormat: 'bracket' });
    expect(qs).toContain('ids[]=1');
    expect(qs).toContain('ids[]=2');
  });

  it('handles arrays with comma format', () => {
    const qs = toQueryString({ ids: [1, 2, 3] }, { arrayFormat: 'comma' });
    expect(qs).toBe('?ids=1%2C2%2C3');
  });
});

describe('parseQueryString', () => {
  it('parses query string to object', () => {
    const obj = parseQueryString('?a=1&b=2');
    expect(obj).toEqual({ a: '1', b: '2' });
  });

  it('handles string without ?', () => {
    const obj = parseQueryString('a=1&b=2');
    expect(obj).toEqual({ a: '1', b: '2' });
  });

  it('handles repeated keys as array', () => {
    const obj = parseQueryString('tag=a&tag=b&tag=c');
    expect(obj.tag).toEqual(['a', 'b', 'c']);
  });

  it('handles bracket notation', () => {
    const obj = parseQueryString('ids[]=1&ids[]=2');
    expect(obj.ids).toEqual(['1', '2']);
  });

  it('handles comma format when configured', () => {
    const obj = parseQueryString('ids=1,2,3', { arrayFormat: 'comma' });
    expect(obj.ids).toEqual(['1', '2', '3']);
  });
});
