# @manufosela/rich-markdown-to-html

Markdown to HTML converter with rich features including tables, code blocks with syntax highlighting classes, and task lists.

## Installation

```bash
npm install @manufosela/rich-markdown-to-html
```

## Usage

### Basic Usage

```javascript
import { parse } from '@manufosela/rich-markdown-to-html';

const html = parse('# Hello World\n\nThis is **bold** text.');
// <h1 id="hello-world">Hello World</h1>
// <p>This is <strong>bold</strong> text.</p>
```

### With Options

```javascript
import { parse } from '@manufosela/rich-markdown-to-html';

const html = parse(markdown, {
  breaks: true,       // Convert line breaks to <br>
  linkify: true,      // Auto-link URLs
  taskLists: true,    // Enable task lists
  tables: true,       // Enable tables
  typographer: true   // Smart quotes and dashes
});
```

### Inline Parsing

```javascript
import { parseInline } from '@manufosela/rich-markdown-to-html';

const html = parseInline('This is **bold** and *italic*');
// This is <strong>bold</strong> and <em>italic</em>
```

### Table of Contents

```javascript
import { generateTOC, renderTOC } from '@manufosela/rich-markdown-to-html';

const markdown = '# Title\n## Section 1\n## Section 2';
const toc = generateTOC(markdown, { maxLevel: 2 });
// [
//   { level: 1, text: 'Title', id: 'title' },
//   { level: 2, text: 'Section 1', id: 'section-1' },
//   { level: 2, text: 'Section 2', id: 'section-2' }
// ]

const tocHtml = renderTOC(toc);
// <nav class="toc"><ul>...</ul></nav>
```

### Escape HTML

```javascript
import { escape } from '@manufosela/rich-markdown-to-html';

const safe = escape('<script>alert("xss")</script>');
// &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;
```

## Supported Syntax

### Headers

```markdown
# H1 Header
## H2 Header
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header

Alt H1
======

Alt H2
------
```

### Emphasis

```markdown
**bold** or __bold__
*italic* or _italic_
~~strikethrough~~
***bold italic***
```

### Links and Images

```markdown
[Link text](url "optional title")
![Alt text](image-url "optional title")

Auto-linked: https://example.com
```

### Code

````markdown
Inline `code`

```javascript
// Fenced code block with language
const x = 1;
```
````

### Lists

```markdown
- Unordered item
- Another item

1. Ordered item
2. Another item

- [x] Completed task
- [ ] Incomplete task
```

### Tables

```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| 1    | 2      | 3     |
```

### Blockquotes

```markdown
> This is a quote
> Multiple lines
```

### Horizontal Rules

```markdown
---
***
___
```

## API Reference

### parse(markdown, options?)

Parses markdown to HTML.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| sanitize | boolean | true | Sanitize HTML output |
| breaks | boolean | false | Convert line breaks to `<br>` |
| linkify | boolean | true | Auto-convert URLs to links |
| typographer | boolean | false | Smart quotes and dashes |
| langPrefix | string | 'language-' | CSS class prefix for code |
| taskLists | boolean | true | Enable task lists |
| tables | boolean | true | Enable tables |
| headerIdPrefix | string | '' | Prefix for header IDs |

### parseInline(text, options?)

Parses inline markdown only (no block elements).

### escape(text)

Escapes HTML special characters.

### generateTOC(markdown, options?)

Generates table of contents entries.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| maxLevel | number | 3 | Maximum heading level |
| prefix | string | '' | ID prefix for links |

### renderTOC(toc)

Renders TOC entries as HTML navigation.

## Styling

### Code Blocks

Code blocks include `data-lang` attribute and language class:

```html
<pre data-lang="javascript">
  <code class="language-javascript">...</code>
</pre>
```

Use with highlight.js or Prism.js for syntax highlighting.

### Task Lists

```html
<ul class="task-list">
  <li class="task-list-item">
    <input type="checkbox" checked disabled> Done
  </li>
</ul>
```

### Tables

Tables include alignment styles:

```html
<th style="text-align: left">Left</th>
<th style="text-align: center">Center</th>
<th style="text-align: right">Right</th>
```

## License

MIT
