/**
 * @fileoverview Tests for rich-markdown-to-html package
 */

import { describe, it, expect } from 'vitest';
import {
  parse,
  parseInline,
  escape,
  generateTOC,
  renderTOC
} from '../src/index.js';

describe('rich-markdown-to-html', () => {
  describe('parse', () => {
    it('should throw error for non-string input', () => {
      expect(() => parse(null)).toThrow('Markdown input must be a string');
      expect(() => parse(123)).toThrow('Markdown input must be a string');
      expect(() => parse(undefined)).toThrow('Markdown input must be a string');
    });

    it('should return empty string for empty input', () => {
      expect(parse('')).toBe('');
    });

    it('removes script tags when sanitize is enabled', () => {
      const result = parse('<script>alert(1)</script>', { sanitize: true });
      expect(result).not.toContain('<script>');
    });

    describe('headers', () => {
      it('should parse h1 headers', () => {
        const result = parse('# Hello World');
        expect(result).toContain('<h1 id="hello-world">Hello World</h1>');
      });

      it('should parse h2 headers', () => {
        const result = parse('## Section Title');
        expect(result).toContain('<h2 id="section-title">Section Title</h2>');
      });

      it('should parse h3-h6 headers', () => {
        expect(parse('### H3')).toContain('<h3');
        expect(parse('#### H4')).toContain('<h4');
        expect(parse('##### H5')).toContain('<h5');
        expect(parse('###### H6')).toContain('<h6');
      });

      it('should generate slugified IDs', () => {
        const result = parse('# Hello World 123!');
        expect(result).toContain('id="hello-world-123"');
      });

      it('should support header ID prefix', () => {
        const result = parse('# Test', { headerIdPrefix: 'doc-' });
        expect(result).toContain('id="doc-test"');
      });

      it('should parse setext-style h1', () => {
        const result = parse('Title\n======');
        expect(result).toContain('<h1');
        expect(result).toContain('Title');
      });

      it('should parse setext-style h2', () => {
        const result = parse('Subtitle\n--------');
        expect(result).toContain('<h2');
        expect(result).toContain('Subtitle');
      });
    });

    describe('emphasis', () => {
      it('should parse bold with **', () => {
        const result = parse('This is **bold** text');
        expect(result).toContain('<strong>bold</strong>');
      });

      it('should parse bold with __', () => {
        const result = parse('This is __bold__ text');
        expect(result).toContain('<strong>bold</strong>');
      });

      it('should parse italic with *', () => {
        const result = parse('This is *italic* text');
        expect(result).toContain('<em>italic</em>');
      });

      it('should parse italic with _', () => {
        const result = parse('This is _italic_ text');
        expect(result).toContain('<em>italic</em>');
      });

      it('should parse strikethrough', () => {
        const result = parse('This is ~~deleted~~ text');
        expect(result).toContain('<del>deleted</del>');
      });

      it('should handle nested emphasis', () => {
        const result = parse('This is ***bold italic*** text');
        expect(result).toContain('<strong>');
        expect(result).toContain('<em>');
      });
    });

    describe('links and images', () => {
      it('should parse links', () => {
        const result = parse('[Google](https://google.com)');
        expect(result).toContain('<a href="https://google.com">Google</a>');
      });

      it('should parse links with titles', () => {
        const result = parse('[Google](https://google.com "Search Engine")');
        expect(result).toContain('title="Search Engine"');
      });

      it('should parse images', () => {
        const result = parse('![Alt text](image.png)');
        expect(result).toContain('<img src="image.png" alt="Alt text">');
      });

      it('should parse images with titles', () => {
        const result = parse('![Alt](image.png "Image title")');
        expect(result).toContain('title="Image title"');
      });

      it('should auto-link URLs when linkify is true', () => {
        const result = parse('Visit https://example.com today', { linkify: true });
        expect(result).toContain('<a href="https://example.com">');
      });

      it('should not auto-link URLs when linkify is false', () => {
        const result = parse('Visit https://example.com today', { linkify: false });
        expect(result).not.toContain('<a href="https://example.com">https://example.com</a>');
      });

      it('sanitizes javascript: URLs when sanitize is enabled', () => {
        const result = parse('[Bad](javascript:alert(1))', { sanitize: true });
        expect(result).toContain('href="#"');
      });
    });

    describe('code', () => {
      it('should parse inline code', () => {
        const result = parse('Use `console.log()` for debugging');
        expect(result).toContain('<code>console.log()</code>');
      });

      it('should escape HTML in inline code', () => {
        const result = parse('Use `<div>` element');
        expect(result).toContain('&lt;div&gt;');
      });

      it('should parse fenced code blocks', () => {
        const result = parse('```\nconst x = 1;\n```');
        expect(result).toContain('<pre>');
        expect(result).toContain('<code>');
        expect(result).toContain('const x = 1;');
      });

      it('should parse fenced code blocks with language', () => {
        const result = parse('```javascript\nconst x = 1;\n```');
        expect(result).toContain('class="language-javascript"');
        expect(result).toContain('data-lang="javascript"');
      });

      it('should escape HTML in code blocks', () => {
        const result = parse('```html\n<div>Test</div>\n```');
        expect(result).toContain('&lt;div&gt;');
      });

      it('should use custom lang prefix', () => {
        const result = parse('```js\ncode\n```', { langPrefix: 'hljs-' });
        expect(result).toContain('class="hljs-js"');
      });
    });

    describe('lists', () => {
      it('should parse unordered lists with -', () => {
        const result = parse('- Item 1\n- Item 2');
        expect(result).toContain('<ul>');
        expect(result).toContain('<li>Item 1</li>');
        expect(result).toContain('<li>Item 2</li>');
      });

      it('should parse unordered lists with *', () => {
        const result = parse('* Item 1\n* Item 2');
        expect(result).toContain('<ul>');
        expect(result).toContain('<li>');
      });

      it('should parse ordered lists', () => {
        const result = parse('1. First\n2. Second');
        expect(result).toContain('<li>First</li>');
        expect(result).toContain('<li>Second</li>');
      });

      it('should parse task lists', () => {
        const result = parse('- [ ] Todo\n- [x] Done', { taskLists: true });
        expect(result).toContain('class="task-list-item"');
        expect(result).toContain('type="checkbox"');
        expect(result).toContain('checked');
      });

      it('should disable task lists when option is false', () => {
        const result = parse('- [ ] Todo', { taskLists: false });
        expect(result).not.toContain('task-list-item');
      });
    });

    describe('blockquotes', () => {
      it('should parse single-line blockquotes', () => {
        const result = parse('> This is a quote');
        expect(result).toContain('<blockquote>');
        expect(result).toContain('This is a quote');
      });

      it('should parse multi-line blockquotes', () => {
        const result = parse('> Line 1\n> Line 2');
        expect(result).toContain('<blockquote>');
      });
    });

    describe('tables', () => {
      it('should parse simple tables', () => {
        const md = '| A | B |\n|---|---|\n| 1 | 2 |';
        const result = parse(md);
        expect(result).toContain('<table>');
        expect(result).toContain('<thead>');
        expect(result).toContain('<tbody>');
        expect(result).toContain('<th>');
        expect(result).toContain('<td>');
      });

      it('should parse table alignment', () => {
        const md = '| Left | Center | Right |\n|:---|:---:|---:|\n| 1 | 2 | 3 |';
        const result = parse(md);
        expect(result).toContain('text-align: left');
        expect(result).toContain('text-align: center');
        expect(result).toContain('text-align: right');
      });

      it('should disable tables when option is false', () => {
        const md = '| A | B |\n|---|---|\n| 1 | 2 |';
        const result = parse(md, { tables: false });
        expect(result).not.toContain('<table>');
      });
    });

    describe('horizontal rules', () => {
      it('should parse --- horizontal rule', () => {
        const result = parse('---');
        expect(result).toContain('<hr>');
      });

      it('should parse *** horizontal rule', () => {
        const result = parse('***');
        expect(result).toContain('<hr>');
      });

      it('should parse ___ horizontal rule', () => {
        const result = parse('___');
        expect(result).toContain('<hr>');
      });
    });

    describe('paragraphs', () => {
      it('should wrap text in paragraphs', () => {
        const result = parse('Hello world');
        expect(result).toContain('<p>Hello world</p>');
      });

      it('should create separate paragraphs', () => {
        const result = parse('Para 1\n\nPara 2');
        expect(result).toContain('<p>Para 1</p>');
        expect(result).toContain('<p>Para 2</p>');
      });

      it('should convert line breaks when breaks option is true', () => {
        const result = parse('Line 1\nLine 2', { breaks: true });
        expect(result).toContain('<br>');
      });
    });

    describe('typographer', () => {
      it('should convert quotes when enabled', () => {
        const result = parse('"Hello"', { typographer: true });
        expect(result).toContain('\u201c');
        expect(result).toContain('\u201d');
      });

      it('should convert dashes when enabled', () => {
        const result = parse('a -- b --- c', { typographer: true });
        expect(result).toContain('\u2013'); // en dash
        expect(result).toContain('\u2014'); // em dash
      });

      it('should convert ellipsis when enabled', () => {
        const result = parse('Wait...', { typographer: true });
        expect(result).toContain('\u2026');
      });
    });
  });

  describe('parseInline', () => {
    it('should throw error for non-string input', () => {
      expect(() => parseInline(null)).toThrow('Text input must be a string');
    });

    it('should parse inline emphasis', () => {
      const result = parseInline('**bold** and *italic*');
      expect(result).toContain('<strong>bold</strong>');
      expect(result).toContain('<em>italic</em>');
    });

    it('should parse inline code', () => {
      const result = parseInline('Use `code` here');
      expect(result).toContain('<code>code</code>');
    });

    it('should parse inline links', () => {
      const result = parseInline('[link](url)');
      expect(result).toContain('<a href="url">link</a>');
    });

    it('should not parse block elements', () => {
      const result = parseInline('# Not a header');
      expect(result).not.toContain('<h1>');
    });
  });

  describe('escape', () => {
    it('should throw error for non-string input', () => {
      expect(() => escape(null)).toThrow('Text input must be a string');
    });

    it('should escape HTML special characters', () => {
      const result = escape('<script>alert("xss")</script>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      expect(result).toContain('&quot;');
    });

    it('should escape ampersands', () => {
      const result = escape('Tom & Jerry');
      expect(result).toBe('Tom &amp; Jerry');
    });

    it('should escape single quotes', () => {
      const result = escape("It's");
      expect(result).toContain('&#39;');
    });
  });

  describe('generateTOC', () => {
    it('should throw error for non-string input', () => {
      expect(() => generateTOC(null)).toThrow('Markdown input must be a string');
    });

    it('should generate TOC from headers', () => {
      const md = '# Title\n## Section 1\n## Section 2\n### Subsection';
      const toc = generateTOC(md);

      expect(toc).toHaveLength(4);
      expect(toc[0]).toEqual({ level: 1, text: 'Title', id: 'title' });
      expect(toc[1]).toEqual({ level: 2, text: 'Section 1', id: 'section-1' });
    });

    it('should respect maxLevel option', () => {
      const md = '# H1\n## H2\n### H3\n#### H4';
      const toc = generateTOC(md, { maxLevel: 2 });

      expect(toc).toHaveLength(2);
    });

    it('should apply prefix to IDs', () => {
      const md = '# Title';
      const toc = generateTOC(md, { prefix: 'doc-' });

      expect(toc[0].id).toBe('doc-title');
    });

    it('should return empty array for no headers', () => {
      const toc = generateTOC('No headers here');
      expect(toc).toHaveLength(0);
    });
  });

  describe('renderTOC', () => {
    it('should throw error for non-array input', () => {
      expect(() => renderTOC('not an array')).toThrow('TOC must be an array');
    });

    it('should return empty string for empty array', () => {
      expect(renderTOC([])).toBe('');
    });

    it('should render TOC as HTML list', () => {
      const toc = [
        { level: 1, text: 'Title', id: 'title' },
        { level: 2, text: 'Section', id: 'section' }
      ];
      const html = renderTOC(toc);

      expect(html).toContain('<nav class="toc">');
      expect(html).toContain('<ul>');
      expect(html).toContain('<a href="#title">Title</a>');
      expect(html).toContain('<a href="#section">Section</a>');
    });

    it('should escape HTML in TOC text', () => {
      const toc = [{ level: 1, text: '<script>XSS</script>', id: 'xss' }];
      const html = renderTOC(toc);

      expect(html).toContain('&lt;script&gt;');
    });
  });
});
