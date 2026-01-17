import { describe, expect, it, vi } from 'vitest';
import { EventEmitter } from '../src/index.js';

describe('EventEmitter', () => {
  it('creates instance with default options', () => {
    const emitter = new EventEmitter();
    expect(emitter).toBeInstanceOf(EventEmitter);
  });

  it('registers and calls listeners', () => {
    const emitter = new EventEmitter();
    let called = false;

    emitter.on('test', () => { called = true; });
    emitter.emit('test');

    expect(called).toBe(true);
  });

  it('passes data to listeners', () => {
    const emitter = new EventEmitter();
    let receivedData = null;

    emitter.on('test', (data) => { receivedData = data; });
    emitter.emit('test', { value: 42 });

    expect(receivedData).toEqual({ value: 42 });
  });

  it('returns unsubscribe function from on()', () => {
    const emitter = new EventEmitter();
    let count = 0;

    const unsubscribe = emitter.on('test', () => { count++; });

    emitter.emit('test');
    expect(count).toBe(1);

    unsubscribe();
    emitter.emit('test');
    expect(count).toBe(1);
  });

  it('removes listener with off()', () => {
    const emitter = new EventEmitter();
    let count = 0;
    const callback = () => { count++; };

    emitter.on('test', callback);
    emitter.emit('test');
    expect(count).toBe(1);

    emitter.off('test', callback);
    emitter.emit('test');
    expect(count).toBe(1);
  });

  it('once() fires only once', () => {
    const emitter = new EventEmitter();
    let count = 0;

    emitter.once('test', () => { count++; });

    emitter.emit('test');
    emitter.emit('test');
    emitter.emit('test');

    expect(count).toBe(1);
  });

  it('supports multiple listeners per event', () => {
    const emitter = new EventEmitter();
    let count = 0;

    emitter.on('test', () => { count++; });
    emitter.on('test', () => { count++; });
    emitter.on('test', () => { count++; });

    emitter.emit('test');
    expect(count).toBe(3);
  });

  it('removeAllListeners() removes all for specific event', () => {
    const emitter = new EventEmitter();
    let count = 0;

    emitter.on('test1', () => { count++; });
    emitter.on('test2', () => { count++; });

    emitter.removeAllListeners('test1');

    emitter.emit('test1');
    emitter.emit('test2');

    expect(count).toBe(1);
  });

  it('removeAllListeners() removes all events when no arg', () => {
    const emitter = new EventEmitter();
    let count = 0;

    emitter.on('test1', () => { count++; });
    emitter.on('test2', () => { count++; });

    emitter.removeAllListeners();

    emitter.emit('test1');
    emitter.emit('test2');

    expect(count).toBe(0);
  });

  it('listenerCount() returns correct count', () => {
    const emitter = new EventEmitter();

    expect(emitter.listenerCount('test')).toBe(0);

    emitter.on('test', () => {});
    expect(emitter.listenerCount('test')).toBe(1);

    emitter.on('test', () => {});
    expect(emitter.listenerCount('test')).toBe(2);
  });

  it('eventNames() returns all event names', () => {
    const emitter = new EventEmitter();

    emitter.on('event1', () => {});
    emitter.on('event2', () => {});
    emitter.on('event3', () => {});

    const names = emitter.eventNames();
    expect(names).toContain('event1');
    expect(names).toContain('event2');
    expect(names).toContain('event3');
  });

  it('hasListeners() returns correct boolean', () => {
    const emitter = new EventEmitter();

    expect(emitter.hasListeners('test')).toBe(false);

    emitter.on('test', () => {});
    expect(emitter.hasListeners('test')).toBe(true);
  });

  it('throws for non-function callback', () => {
    const emitter = new EventEmitter();

    expect(() => emitter.on('test', 'not a function')).toThrow(TypeError);
  });

  it('handles errors in listeners gracefully', () => {
    const emitter = new EventEmitter();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    let secondCalled = false;

    emitter.on('test', () => { throw new Error('Test error'); });
    emitter.on('test', () => { secondCalled = true; });

    emitter.emit('test');

    expect(secondCalled).toBe(true);
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});
