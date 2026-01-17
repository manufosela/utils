# @manufosela/url-params

URL parameter management utility for getting, setting, and manipulating URL query strings.

## Installation

```bash
pnpm add @manufosela/url-params
```

## Usage

### Quick Functions

```javascript
import { getParam, setParam, getParams, removeParam } from '@manufosela/url-params';

// Get a parameter (current URL: ?page=2&sort=name)
const page = getParam('page'); // '2'
const missing = getParam('foo', 'default'); // 'default'

// Get all parameters
const params = getParams(); // { page: '2', sort: 'name' }

// Set a parameter (updates browser URL)
setParam('page', 3);

// Remove a parameter
removeParam('sort');
```

### UrlParams Class

```javascript
import { UrlParams } from '@manufosela/url-params';

// Parse any URL
const params = new UrlParams('https://example.com?a=1&b=2');

params.get('a'); // '1'
params.set('c', 3);
params.remove('a');

console.log(params.toURL()); // 'https://example.com?b=2&c=3'
```

### Chaining

```javascript
const params = new UrlParams('https://example.com');

const url = params
  .set('page', 1)
  .set('limit', 10)
  .set('sort', 'name')
  .remove('old')
  .toURL();
```

### Auto-update Browser URL

```javascript
const params = new UrlParams(undefined, { autoUpdate: true });

params.set('page', 2); // Immediately updates browser URL
params.remove('filter'); // Also updates browser URL
```

### Arrays

```javascript
import { toQueryString, parseQueryString } from '@manufosela/url-params';

// Multiple values
const params = new UrlParams('?tags=a&tags=b&tags=c');
params.getAll('tags'); // ['a', 'b', 'c']
params.get('tags'); // 'a' (first value)

// Different array formats
toQueryString({ ids: [1, 2, 3] }, { arrayFormat: 'repeat' });
// ?ids=1&ids=2&ids=3

toQueryString({ ids: [1, 2, 3] }, { arrayFormat: 'bracket' });
// ?ids[]=1&ids[]=2&ids[]=3

toQueryString({ ids: [1, 2, 3] }, { arrayFormat: 'comma' });
// ?ids=1,2,3

parseQueryString('ids=1,2,3', { arrayFormat: 'comma' });
// { ids: ['1', '2', '3'] }
```

## Demo

`https://manufosela.github.io/utils/packages/url-params/demo/`

## API

### UrlParams Class

#### Constructor

```javascript
new UrlParams(url?, options?)
```

| Parameter | Type                | Default       | Description            |
| --------- | ------------------- | ------------- | ---------------------- |
| `url`     | `string \| URL`     | current URL   | URL to parse           |
| `options` | `UrlParamsOptions`  | `{}`          | Configuration options  |

**Options:**

| Option        | Type      | Default    | Description                |
| ------------- | --------- | ---------- | -------------------------- |
| `useHash`     | `Boolean` | `false`    | Use hash params (`#`)      |
| `autoUpdate`  | `Boolean` | `false`    | Auto-update browser URL    |
| `arrayFormat` | `String`  | `'repeat'` | Array serialization format |

#### Methods

##### `get(key, defaultValue?)`

Get a parameter value.

```javascript
params.get('page'); // '2' or null
params.get('page', '1'); // '2' or '1'
```

##### `getAll(key)`

Get all values for a parameter.

```javascript
params.getAll('tags'); // ['js', 'ts']
```

##### `getObject()`

Get all parameters as an object.

```javascript
params.getObject(); // { page: '2', tags: ['js', 'ts'] }
```

##### `set(key, value)`

Set a parameter. Chainable.

```javascript
params.set('page', 2);
params.set('tags', ['a', 'b']); // Multiple values
params.set('empty', null); // Removes param
```

##### `setAll(params)`

Set multiple parameters. Chainable.

```javascript
params.setAll({ page: 1, limit: 10 });
```

##### `append(key, value)`

Append a value (for arrays). Chainable.

```javascript
params.append('tags', 'new');
```

##### `remove(key)`

Remove a parameter. Chainable.

```javascript
params.remove('page');
```

##### `has(key)`

Check if parameter exists.

```javascript
params.has('page'); // true/false
```

##### `clear()`

Remove all parameters. Chainable.

```javascript
params.clear();
```

##### `toString()`

Get query string.

```javascript
params.toString(); // '?page=2&sort=name'
```

##### `toURL()`

Get full URL.

```javascript
params.toURL(); // 'https://example.com?page=2'
```

##### `apply()`

Apply changes to browser URL.

```javascript
params.apply();
```

### Standalone Functions

| Function           | Description                        |
| ------------------ | ---------------------------------- |
| `getParam(key)`    | Get param from current URL         |
| `getParams()`      | Get all params from current URL    |
| `setParam(k, v)`   | Set param in current URL           |
| `setParams(obj)`   | Set multiple params in current URL |
| `removeParam(key)` | Remove param from current URL      |
| `hasParam(key)`    | Check if param exists              |
| `toQueryString()`  | Convert object to query string     |
| `parseQueryString()`| Parse query string to object      |

## TypeScript

TypeScript definitions are included:

```typescript
import { UrlParams, getParam, ParamsObject } from '@manufosela/url-params';

const params: ParamsObject = { page: 1, sort: 'name' };
const page: string | null = getParam('page');
```

## License

MIT
