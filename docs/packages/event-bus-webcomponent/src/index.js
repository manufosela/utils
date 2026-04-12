export const ALL = 'ALL';
export const ALL_TYPES = 'ALL-TYPES';
export const DEFAULT_EVENT_NAME = 'wc-bus';

export function createComponentRef(input) {
  if (!input) {
    throw new Error('Component reference is required');
  }

  if (input instanceof Element) {
    const id = input.id;
    const type = input.tagName.toLowerCase();
    if (!id) {
      throw new Error('Component element must have an id');
    }
    return { id, type };
  }

  const { id, type } = input;
  if (!id || !type) {
    throw new Error('Component reference must include id and type');
  }
  return { id, type };
}

export function normalizeTarget(target = {}) {
  return {
    id: target.id || ALL,
    type: target.type || ALL_TYPES,
    excludeSource: Boolean(target.excludeSource),
  };
}

export function createEnvelope({ name, detail, source, target }) {
  if (!name) {
    throw new Error('Event name is required');
  }

  const normalizedSource = createComponentRef(source);
  const normalizedTarget = normalizeTarget(target);

  return {
    name,
    detail,
    source: normalizedSource,
    target: normalizedTarget,
    timestamp: Date.now(),
  };
}

export function matchesTarget(target, component) {
  if (!target || !component) {
    return false;
  }

  const idMatch = target.id === ALL || target.id === component.id;
  const typeMatch = target.type === ALL_TYPES || target.type === component.type;

  return idMatch && typeMatch;
}

export function shouldExcludeSource(target, source, component) {
  if (!target || !target.excludeSource || !source || !component) {
    return false;
  }

  return source.id === component.id && source.type === component.type;
}

export class WebComponentEventBus {
  constructor({ root = document, eventName = DEFAULT_EVENT_NAME } = {}) {
    if (!root || typeof root.addEventListener !== 'function') {
      throw new Error('A valid EventTarget root is required');
    }
    this.root = root;
    this.eventName = eventName;
  }

  emit({ name, detail, source, target }) {
    const envelope = createEnvelope({ name, detail, source, target });
    const event = new CustomEvent(this.eventName, {
      detail: envelope,
      bubbles: true,
      composed: true,
    });
    this.root.dispatchEvent(event);
    return envelope;
  }

  on(component, handler, options = {}) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }

    const componentRef = createComponentRef(component);
    const { name } = options;

    const listener = (event) => {
      const envelope = event.detail;
      if (!envelope || !envelope.target) {
        return;
      }
      if (name && envelope.name !== name) {
        return;
      }
      if (shouldExcludeSource(envelope.target, envelope.source, componentRef)) {
        return;
      }
      if (!matchesTarget(envelope.target, componentRef)) {
        return;
      }
      handler(envelope, event);
    };

    this.root.addEventListener(this.eventName, listener);
    return () => this.root.removeEventListener(this.eventName, listener);
  }

  once(component, handler, options = {}) {
    const off = this.on(component, (envelope, event) => {
      off();
      handler(envelope, event);
    }, options);
    return off;
  }
}
