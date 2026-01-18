import { describe, it, expect, vi } from 'vitest';
import {
  WebComponentEventBus,
  ALL,
  ALL_TYPES,
  createEnvelope,
  createComponentRef,
  normalizeTarget,
  matchesTarget,
  shouldExcludeSource,
} from '../src/index.js';

describe('event-bus-webcomponent', () => {
  it('creates envelope with required fields', () => {
    const envelope = createEnvelope({
      name: 'ping',
      detail: { ok: true },
      source: { id: 'a', type: 'comp-a' },
      target: { id: ALL, type: ALL_TYPES },
    });

    expect(envelope.name).toBe('ping');
    expect(envelope.source.id).toBe('a');
    expect(envelope.target.type).toBe(ALL_TYPES);
  });

  it('matches target with ALL rules', () => {
    const target = { id: ALL, type: ALL_TYPES };
    const component = { id: 'x', type: 'comp-x' };
    expect(matchesTarget(target, component)).toBe(true);
  });

  it('normalizes target defaults', () => {
    const target = normalizeTarget();
    expect(target.id).toBe(ALL);
    expect(target.type).toBe(ALL_TYPES);
    expect(target.excludeSource).toBe(false);
  });

  it('creates component ref from element', () => {
    const el = document.createElement('my-widget');
    el.id = 'widget-1';
    const ref = createComponentRef(el);
    expect(ref).toEqual({ id: 'widget-1', type: 'my-widget' });
  });

  it('throws when element is missing id', () => {
    const el = document.createElement('demo-widget');
    expect(() => createComponentRef(el)).toThrow('Component element must have an id');
  });

  it('delivers events to matching component', () => {
    const bus = new WebComponentEventBus();
    const handler = vi.fn();

    bus.on({ id: 'widget-1', type: 'demo-widget' }, handler);

    bus.emit({
      name: 'demo',
      detail: { value: 1 },
      source: { id: 'sender', type: 'sender' },
      target: { id: 'widget-1', type: 'demo-widget' },
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('throws when handler is invalid', () => {
    const bus = new WebComponentEventBus();
    expect(() => bus.on({ id: 'a', type: 'demo' }, null)).toThrow('Handler must be a function');
  });

  it('filters by event name when provided', () => {
    const bus = new WebComponentEventBus();
    const handler = vi.fn();

    bus.on({ id: 'widget-1', type: 'demo-widget' }, handler, { name: 'only-this' });

    bus.emit({
      name: 'other',
      detail: {},
      source: { id: 'sender', type: 'sender' },
      target: { id: 'widget-1', type: 'demo-widget' },
    });

    bus.emit({
      name: 'only-this',
      detail: {},
      source: { id: 'sender', type: 'sender' },
      target: { id: 'widget-1', type: 'demo-widget' },
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('once() only handles first matching event', () => {
    const bus = new WebComponentEventBus();
    const handler = vi.fn();

    bus.once({ id: 'widget-1', type: 'demo-widget' }, handler);

    bus.emit({
      name: 'demo',
      detail: {},
      source: { id: 'sender', type: 'sender' },
      target: { id: 'widget-1', type: 'demo-widget' },
    });

    bus.emit({
      name: 'demo',
      detail: {},
      source: { id: 'sender', type: 'sender' },
      target: { id: 'widget-1', type: 'demo-widget' },
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('excludes source when requested', () => {
    const target = { id: ALL, type: ALL_TYPES, excludeSource: true };
    const source = { id: 'widget-1', type: 'demo-widget' };
    const component = { id: 'widget-1', type: 'demo-widget' };

    expect(shouldExcludeSource(target, source, component)).toBe(true);
  });
});
