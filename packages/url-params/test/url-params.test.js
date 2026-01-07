import { expect } from '@open-wc/testing';
import {
  UrlParams,
  toQueryString,
  parseQueryString,
} from '../src/index.js';

describe('UrlParams', () => {
  it('creates instance from URL string', () => {
    const params = new UrlParams('https://example.com?a=1&b=2');
    expect(params.get('a')).to.equal('1');
    expect(params.get('b')).to.equal('2');
  });

  it('get() returns null for missing key', () => {
    const params = new UrlParams('https://example.com');
    expect(params.get('missing')).to.be.null;
  });

  it('get() returns default value for missing key', () => {
    const params = new UrlParams('https://example.com');
    expect(params.get('missing', 'default')).to.equal('default');
  });

  it('set() adds new parameter', () => {
    const params = new UrlParams('https://example.com');
    params.set('key', 'value');
    expect(params.get('key')).to.equal('value');
  });

  it('set() updates existing parameter', () => {
    const params = new UrlParams('https://example.com?key=old');
    params.set('key', 'new');
    expect(params.get('key')).to.equal('new');
  });

  it('set() with null removes parameter', () => {
    const params = new UrlParams('https://example.com?key=value');
    params.set('key', null);
    expect(params.has('key')).to.be.false;
  });

  it('set() handles arrays', () => {
    const params = new UrlParams('https://example.com');
    params.set('tags', ['a', 'b', 'c']);
    expect(params.getAll('tags')).to.deep.equal(['a', 'b', 'c']);
  });

  it('setAll() sets multiple parameters', () => {
    const params = new UrlParams('https://example.com');
    params.setAll({ a: 1, b: 2, c: 3 });
    expect(params.get('a')).to.equal('1');
    expect(params.get('b')).to.equal('2');
    expect(params.get('c')).to.equal('3');
  });

  it('append() adds to existing values', () => {
    const params = new UrlParams('https://example.com?tag=a');
    params.append('tag', 'b');
    expect(params.getAll('tag')).to.deep.equal(['a', 'b']);
  });

  it('remove() deletes parameter', () => {
    const params = new UrlParams('https://example.com?a=1&b=2');
    params.remove('a');
    expect(params.has('a')).to.be.false;
    expect(params.has('b')).to.be.true;
  });

  it('has() returns correct boolean', () => {
    const params = new UrlParams('https://example.com?exists=1');
    expect(params.has('exists')).to.be.true;
    expect(params.has('missing')).to.be.false;
  });

  it('clear() removes all parameters', () => {
    const params = new UrlParams('https://example.com?a=1&b=2&c=3');
    params.clear();
    expect(params.toString()).to.equal('');
  });

  it('getObject() returns all params as object', () => {
    const params = new UrlParams('https://example.com?a=1&b=2');
    const obj = params.getObject();
    expect(obj).to.deep.equal({ a: '1', b: '2' });
  });

  it('getObject() handles arrays', () => {
    const params = new UrlParams('https://example.com?tag=a&tag=b');
    const obj = params.getObject();
    expect(obj.tag).to.deep.equal(['a', 'b']);
  });

  it('toString() returns query string', () => {
    const params = new UrlParams('https://example.com?a=1&b=2');
    expect(params.toString()).to.equal('?a=1&b=2');
  });

  it('toString() returns empty for no params', () => {
    const params = new UrlParams('https://example.com');
    expect(params.toString()).to.equal('');
  });

  it('toURL() returns full URL', () => {
    const params = new UrlParams('https://example.com?a=1');
    params.set('b', 2);
    expect(params.toURL()).to.include('example.com');
    expect(params.toURL()).to.include('a=1');
    expect(params.toURL()).to.include('b=2');
  });

  it('supports method chaining', () => {
    const params = new UrlParams('https://example.com');
    const result = params.set('a', 1).set('b', 2).remove('a').toString();
    expect(result).to.equal('?b=2');
  });
});

describe('toQueryString', () => {
  it('converts object to query string', () => {
    const qs = toQueryString({ a: 1, b: 'hello' });
    expect(qs).to.equal('?a=1&b=hello');
  });

  it('handles empty object', () => {
    const qs = toQueryString({});
    expect(qs).to.equal('');
  });

  it('handles null/undefined values', () => {
    const qs = toQueryString({ a: 1, b: null, c: undefined });
    expect(qs).to.equal('?a=1');
  });

  it('handles arrays with repeat format', () => {
    const qs = toQueryString({ ids: [1, 2, 3] }, { arrayFormat: 'repeat' });
    expect(qs).to.equal('?ids=1&ids=2&ids=3');
  });

  it('handles arrays with bracket format', () => {
    const qs = toQueryString({ ids: [1, 2] }, { arrayFormat: 'bracket' });
    expect(qs).to.include('ids[]=1');
    expect(qs).to.include('ids[]=2');
  });

  it('handles arrays with comma format', () => {
    const qs = toQueryString({ ids: [1, 2, 3] }, { arrayFormat: 'comma' });
    expect(qs).to.equal('?ids=1%2C2%2C3');
  });
});

describe('parseQueryString', () => {
  it('parses query string to object', () => {
    const obj = parseQueryString('?a=1&b=2');
    expect(obj).to.deep.equal({ a: '1', b: '2' });
  });

  it('handles string without ?', () => {
    const obj = parseQueryString('a=1&b=2');
    expect(obj).to.deep.equal({ a: '1', b: '2' });
  });

  it('handles repeated keys as array', () => {
    const obj = parseQueryString('tag=a&tag=b&tag=c');
    expect(obj.tag).to.deep.equal(['a', 'b', 'c']);
  });

  it('handles bracket notation', () => {
    const obj = parseQueryString('ids[]=1&ids[]=2');
    expect(obj.ids).to.deep.equal(['1', '2']);
  });
});
