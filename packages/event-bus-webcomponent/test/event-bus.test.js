import { describe, it, expect, vi } from 'vitest';
import {
  WebComponentEventBus,
  ALL,
  ALL_TYPES,
  createEnvelope,
  matchesTarget,
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
});
