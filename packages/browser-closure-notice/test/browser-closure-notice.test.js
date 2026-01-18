import { describe, it, expect, vi } from 'vitest';
import { BrowserClosureNotice } from '../src/index.js';

describe('BrowserClosureNotice', () => {
  const setUserAgent = (value) => {
    Object.defineProperty(navigator, 'userAgent', {
      value,
      configurable: true,
    });
  };

  it('creates instance with defaults', () => {
    const instance = new BrowserClosureNotice();
    expect(instance).toBeInstanceOf(BrowserClosureNotice);
  });

  it('registers and unregisters mousemove listener', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const instance = new BrowserClosureNotice();
    instance.detect();
    instance.unDetect();

    expect(addSpy).toHaveBeenCalledWith('mousemove', instance.mousemovemethod);
    expect(removeSpy).toHaveBeenCalled();

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('clamps negative mouse positions', () => {
    const instance = new BrowserClosureNotice();
    const result = instance.getMousePos({ clientX: -10, clientY: -20 });

    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('fires callback when mouse moves toward close area', () => {
    setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    const callback = vi.fn();
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    window.innerWidth = 1000;
    const instance = new BrowserClosureNotice({
      stepsTakenToClose: 1,
      distanceNearClose: 50,
      maxTimes: 1,
      callback,
    });

    instance.detect();
    instance.mousemovemethod({ clientX: 10, clientY: 100 });
    instance.mousemovemethod({ clientX: 960, clientY: 0 });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalled();

    removeSpy.mockRestore();
  });

  it('respects unlimited maxTimes', () => {
    setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    const callback = vi.fn();

    window.innerWidth = 1000;
    const instance = new BrowserClosureNotice({
      stepsTakenToClose: 1,
      distanceNearClose: 50,
      maxTimes: 0,
      callback,
    });

    instance.mousemovemethod({ clientX: 10, clientY: 100 });
    instance.mousemovemethod({ clientX: 960, clientY: 0 });
    instance.mousemovemethod({ clientX: 980, clientY: 0 });

    expect(callback).toHaveBeenCalledTimes(2);
  });
});
