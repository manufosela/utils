import { describe, it, expect, vi } from 'vitest';
import { BrowserClosureNotice } from '../src/index.js';

describe('BrowserClosureNotice', () => {
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
});
