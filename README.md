# @manufosela/utils

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

Utilities monorepo with small, focused libraries and demos for modern web development.

## Demo

Visit the [catalog](https://manufosela.github.io/utils/) to browse all utilities and demos.

## Packages

| Package | Version | Description |
| ------- | ------- | ----------- |
| [@manufosela/automatic-form-validation](./packages/automatic-form-validation) | ![npm](https://img.shields.io/npm/v/@manufosela/automatic-form-validation) | Form validation with data attributes |
| [@manufosela/browser-closure-notice](./packages/browser-closure-notice) | ![npm](https://img.shields.io/npm/v/@manufosela/browser-closure-notice) | Detects mouse movement toward browser close |
| [@manufosela/convert2webp](./packages/convert2webp) | ![npm](https://img.shields.io/npm/v/@manufosela/convert2webp) | Canvas-based image conversion to WebP |
| [@manufosela/debounce-throttle](./packages/debounce-throttle) | ![npm](https://img.shields.io/npm/v/@manufosela/debounce-throttle) | Debounce and throttle helpers |
| [@manufosela/event-emitter](./packages/event-emitter) | ![npm](https://img.shields.io/npm/v/@manufosela/event-emitter) | Lightweight pub/sub event emitter |
| [@manufosela/event-bus-webcomponent](./packages/event-bus-webcomponent) | ![npm](https://img.shields.io/npm/v/@manufosela/event-bus-webcomponent) | CustomEvent bus for web components |
| [@manufosela/local-storage-helper](./packages/local-storage-helper) | ![npm](https://img.shields.io/npm/v/@manufosela/local-storage-helper) | localStorage wrapper with TTL support |
| [@manufosela/rich-markdown-to-html](./packages/rich-markdown-to-html) | ![npm](https://img.shields.io/npm/v/@manufosela/rich-markdown-to-html) | Markdown to HTML converter |
| [@manufosela/system-capabilities](./packages/system-capabilities) | ![npm](https://img.shields.io/npm/v/@manufosela/system-capabilities) | Browser/system feature detection |
| [@manufosela/url-params](./packages/url-params) | ![npm](https://img.shields.io/npm/v/@manufosela/url-params) | URL parameter helpers |

## Installation

Install individual packages as needed:

```bash
pnpm add @manufosela/automatic-form-validation
pnpm add @manufosela/event-emitter
pnpm add @manufosela/url-params
```

## Usage

```javascript
import { EventEmitter } from '@manufosela/event-emitter';
import { UrlParams } from '@manufosela/url-params';
```

## Development

### Prerequisites

- Node.js >= 18
- pnpm

### Setup

```bash
git clone https://github.com/manufosela/utils.git
cd utils
pnpm install
```

### Commands

```bash
pnpm dev       # run all dev servers in parallel
pnpm build     # build all packages
pnpm test      # run all tests
pnpm lint      # lint all packages
```

### Project Structure

```
utils/
├── packages/                  # Individual utility packages
│   ├── automatic-form-validation/
│   ├── browser-closure-notice/
│   ├── convert2webp/
│   ├── debounce-throttle/
│   ├── event-bus-webcomponent/
│   ├── event-emitter/
│   ├── local-storage-helper/
│   ├── rich-markdown-to-html/
│   ├── system-capabilities/
│   └── url-params/
├── index.html                 # Utilities catalog
└── pnpm-workspace.yaml
```

## Releasing

This monorepo uses [Changesets](https://github.com/changesets/changesets) for versioning.

```bash
pnpm changeset
pnpm changeset version
pnpm publish -r --access public
```
