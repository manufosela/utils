import { expect } from '@open-wc/testing';
import { LocalStorageHelper, createStorage } from '../src/index.js';

describe('LocalStorageHelper', () => {
  let storage;

  beforeEach(() => {
    localStorage.clear();
    storage = new LocalStorageHelper({ prefix: 'test_' });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('creates instance with default options', () => {
    const s = new LocalStorageHelper();
    expect(s).to.be.instanceOf(LocalStorageHelper);
  });

  it('sets and gets values', () => {
    storage.set('key', 'value');
    expect(storage.get('key')).to.equal('value');
  });

  it('handles objects', () => {
    const obj = { name: 'John', age: 30 };
    storage.set('user', obj);
    expect(storage.get('user')).to.deep.equal(obj);
  });

  it('handles arrays', () => {
    const arr = [1, 2, 3, 4, 5];
    storage.set('numbers', arr);
    expect(storage.get('numbers')).to.deep.equal(arr);
  });

  it('returns null for non-existent keys', () => {
    expect(storage.get('nonexistent')).to.be.null;
  });

  it('returns default value for non-existent keys', () => {
    expect(storage.get('nonexistent', 'default')).to.equal('default');
  });

  it('removes values', () => {
    storage.set('key', 'value');
    storage.remove('key');
    expect(storage.get('key')).to.be.null;
  });

  it('has() returns correct boolean', () => {
    expect(storage.has('key')).to.be.false;
    storage.set('key', 'value');
    expect(storage.has('key')).to.be.true;
  });

  it('keys() returns all keys', () => {
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');
    storage.set('key3', 'value3');

    const keys = storage.keys();
    expect(keys).to.have.lengthOf(3);
    expect(keys).to.include('key1');
    expect(keys).to.include('key2');
    expect(keys).to.include('key3');
  });

  it('clear() removes all prefixed keys', () => {
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');

    // Set without prefix
    localStorage.setItem('other', 'value');

    storage.clear();

    expect(storage.keys()).to.have.lengthOf(0);
    expect(localStorage.getItem('other')).to.equal('value');
  });

  it('respects TTL', async () => {
    storage.set('temp', 'value', 100); // 100ms TTL

    expect(storage.get('temp')).to.equal('value');

    await new Promise(resolve => setTimeout(resolve, 150));

    expect(storage.get('temp')).to.be.null;
  });

  it('getTTL() returns remaining time', () => {
    storage.set('temp', 'value', 10000); // 10s TTL

    const ttl = storage.getTTL('temp');
    expect(ttl).to.be.greaterThan(9000);
    expect(ttl).to.be.lessThanOrEqual(10000);
  });

  it('getTTL() returns null for no TTL', () => {
    storage.set('permanent', 'value');
    expect(storage.getTTL('permanent')).to.be.null;
  });

  it('setTTL() updates expiration', () => {
    storage.set('key', 'value', 1000);
    storage.setTTL('key', 5000);

    const ttl = storage.getTTL('key');
    expect(ttl).to.be.greaterThan(4000);
  });

  it('getSize() returns size info', () => {
    storage.set('key1', 'short');
    storage.set('key2', 'a longer value');

    const size = storage.getSize();
    expect(size.items).to.equal(2);
    expect(size.used).to.be.greaterThan(0);
  });

  it('uses prefix correctly', () => {
    storage.set('key', 'value');
    expect(localStorage.getItem('test_key')).to.not.be.null;
    expect(localStorage.getItem('key')).to.be.null;
  });

  it('createStorage() creates namespaced instance', () => {
    const userStorage = createStorage('user');
    userStorage.set('name', 'John');

    expect(localStorage.getItem('user_name')).to.not.be.null;
  });

  it('respects defaultTTL option', async () => {
    const s = new LocalStorageHelper({ prefix: 'ttl_', defaultTTL: 100 });
    s.set('key', 'value');

    expect(s.get('key')).to.equal('value');

    await new Promise(resolve => setTimeout(resolve, 150));

    expect(s.get('key')).to.be.null;
  });
});
