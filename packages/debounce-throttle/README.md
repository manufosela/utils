# @manufosela/debounce-throttle

Debounce, throttle, and rate-limit helpers for UI events and async workflows.

## Installation

```bash
pnpm add @manufosela/debounce-throttle
```

## Demo

Live demo: `https://manufosela.github.io/utils/packages/debounce-throttle/demo/`.

## Usage

```js
import { debounce, throttle, once, delay, defer, rateLimit } from '@manufosela/debounce-throttle';

const onInput = debounce((value) => {
  console.log('Search:', value);
}, 300);

const onScroll = throttle(() => {
  console.log('scroll');
}, 200);
```

## API

### debounce(fn, delay, options)

- `leading` (default: `false`)
- `trailing` (default: `true`)
- `maxWait` (optional)

### throttle(fn, limit, options)

- `leading` (default: `true`)
- `trailing` (default: `true`)

### once(fn)

Run only once and return the first result on subsequent calls.

### defer(fn, ...args)

Run at the end of the current call stack.

### delay(fn, wait, ...args)

Invoke after `wait` milliseconds. Returns the timeout id.

### rateLimit(fn, limit, period)

Allow at most `limit` calls per `period` milliseconds.

## License

MIT
