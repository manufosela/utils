/**
 * @fileoverview Markdown to HTML converter with rich features
 * @module @manufosela/rich-markdown-to-html
 * @author manufosela
 * @license MIT
 */

/**
 * @typedef {Object} ParseOptions
 * @property {boolean} [sanitize=true] - Sanitize HTML output
 * @property {boolean} [breaks=false] - Convert line breaks to <br>
 * @property {boolean} [linkify=true] - Auto-convert URLs to links
 * @property {boolean} [typographer=false] - Enable typographic replacements
 * @property {string} [langPrefix='language-'] - CSS class prefix for code blocks
 * @property {boolean} [taskLists=true] - Enable task list rendering
 * @property {boolean} [tables=true] - Enable table rendering
 * @property {boolean} [highlight=true] - Enable syntax highlighting classes
 * @property {string} [headerIdPrefix=''] - Prefix for header IDs
 * @property {Function} [highlightFn] - Custom highlight function
 */

/**
 * Default parse options
 * @type {ParseOptions}
 */
const DEFAULT_OPTIONS = {
  sanitize: true,
  breaks: false,
  linkify: true,
  typographer: false,
  langPrefix: 'language-',
  taskLists: true,
  tables: true,
  highlight: true,
  headerIdPrefix: ''
};

/**
 * Escapes HTML special characters
 * @private
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}

/**
 * Generates a slug from text for header IDs
 * @private
 * @param {string} text - Text to slugify
 * @param {string} prefix - ID prefix
 * @returns {string} Slugified text
 */
function slugify(text, prefix = '') {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return prefix ? `${prefix}${slug}` : slug;
}

/**
 * Parses code blocks (fenced and indented)
 * @private
 * @param {string} text - Markdown text
 * @param {ParseOptions} options - Parse options
 * @returns {string} Text with code blocks converted
 */
function parseCodeBlocks(text, options) {
  // Fenced code blocks with language
  text = text.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (match, lang, code) => {
      const escapedCode = escapeHtml(code.trim());
      const langClass = lang ? ` class="${options.langPrefix}${lang}"` : '';
      const dataLang = lang ? ` data-lang="${lang}"` : '';
      return `<pre${dataLang}><code${langClass}>${escapedCode}</code></pre>`;
    }
  );

  // Inline code
  text = text.replace(
    /`([^`\n]+)`/g,
    (match, code) => `<code>${escapeHtml(code)}</code>`
  );

  return text;
}

/**
 * Parses headers
 * @private
 * @param {string} text - Markdown text
 * @param {ParseOptions} options - Parse options
 * @returns {string} Text with headers converted
 */
function parseHeaders(text, options) {
  // ATX-style headers (# Header)
  text = text.replace(
    /^(#{1,6})\s+(.+)$/gm,
    (match, hashes, content) => {
      const level = hashes.length;
      const id = slugify(content, options.headerIdPrefix);
      return `<h${level} id="${id}">${content.trim()}</h${level}>`;
    }
  );

  // Setext-style headers (underlined)
  text = text.replace(
    /^(.+)\n={2,}$/gm,
    (match, content) => {
      const id = slugify(content, options.headerIdPrefix);
      return `<h1 id="${id}">${content.trim()}</h1>`;
    }
  );

  text = text.replace(
    /^(.+)\n-{2,}$/gm,
    (match, content) => {
      const id = slugify(content, options.headerIdPrefix);
      return `<h2 id="${id}">${content.trim()}</h2>`;
    }
  );

  return text;
}

/**
 * Parses emphasis (bold, italic, strikethrough)
 * @private
 * @param {string} text - Markdown text
 * @returns {string} Text with emphasis converted
 */
function parseEmphasis(text) {
  // Bold with ** or __
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic with * or _
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/_(.+?)_/g, '<em>$1</em>');

  // Strikethrough with ~~
  text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');

  return text;
}

/**
 * Parses links and images
 * @private
 * @param {string} text - Markdown text
 * @param {ParseOptions} options - Parse options
 * @returns {string} Text with links and images converted
 */
function parseLinksAndImages(text, options) {
  // Images: ![alt](url "title")
  text = text.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (match, alt, url, title) => {
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      return `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}"${titleAttr}>`;
    }
  );

  // Links: [text](url "title")
  text = text.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (match, text, url, title) => {
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      return `<a href="${escapeHtml(url)}"${titleAttr}>${text}</a>`;
    }
  );

  // Auto-link URLs if linkify is enabled
  if (options.linkify) {
    text = text.replace(
      /(?<!["\(])(https?:\/\/[^\s<>\[\]]+)(?!["\)])/g,
      '<a href="$1">$1</a>'
    );
  }

  return text;
}

/**
 * Parses lists (ordered, unordered, and task lists)
 * @private
 * @param {string} text - Markdown text
 * @param {ParseOptions} options - Parse options
 * @returns {string} Text with lists converted
 */
function parseLists(text, options) {
  // Task lists
  if (options.taskLists) {
    text = text.replace(
      /^(\s*)[-*]\s+\[([ xX])\]\s+(.+)$/gm,
      (match, indent, checked, content) => {
        const isChecked = checked.toLowerCase() === 'x';
        const checkedAttr = isChecked ? ' checked disabled' : ' disabled';
        return `${indent}<li class="task-list-item"><input type="checkbox"${checkedAttr}> ${content}</li>`;
      }
    );
  }

  // Unordered lists
  text = text.replace(
    /^(\s*)[-*+]\s+(?!\[[ xX]\])(.+)$/gm,
    '$1<li>$2</li>'
  );

  // Ordered lists
  text = text.replace(
    /^(\s*)\d+\.\s+(.+)$/gm,
    '$1<li>$2</li>'
  );

  // Wrap consecutive <li> items in <ul> or <ol>
  // This is a simplified approach - wrap all li items
  const lines = text.split('\n');
  const result = [];
  let inList = false;
  let listType = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isListItem = line.trim().startsWith('<li');
    const isTaskItem = line.includes('task-list-item');

    if (isListItem && !inList) {
      inList = true;
      listType = isTaskItem ? 'ul class="task-list"' : 'ul';
      result.push(`<${listType}>`);
    } else if (!isListItem && inList) {
      result.push(`</${listType.split(' ')[0]}>`);
      inList = false;
      listType = null;
    }

    result.push(line);
  }

  if (inList) {
    result.push(`</${listType.split(' ')[0]}>`);
  }

  return result.join('\n');
}

/**
 * Parses blockquotes
 * @private
 * @param {string} text - Markdown text
 * @returns {string} Text with blockquotes converted
 */
function parseBlockquotes(text) {
  // Multi-line blockquotes
  const lines = text.split('\n');
  const result = [];
  let inBlockquote = false;

  for (const line of lines) {
    if (line.startsWith('>')) {
      if (!inBlockquote) {
        result.push('<blockquote>');
        inBlockquote = true;
      }
      result.push(line.replace(/^>\s?/, ''));
    } else {
      if (inBlockquote) {
        result.push('</blockquote>');
        inBlockquote = false;
      }
      result.push(line);
    }
  }

  if (inBlockquote) {
    result.push('</blockquote>');
  }

  return result.join('\n');
}

/**
 * Parses tables
 * @private
 * @param {string} text - Markdown text
 * @param {ParseOptions} options - Parse options
 * @returns {string} Text with tables converted
 */
function parseTables(text, options) {
  if (!options.tables) return text;

  const tableRegex = /^(\|.+\|)\n(\|[-:\s|]+\|)\n((?:\|.+\|\n?)+)/gm;

  return text.replace(tableRegex, (match, headerRow, separatorRow, bodyRows) => {
    // Parse alignment from separator row
    const alignments = separatorRow
      .split('|')
      .filter(cell => cell.trim())
      .map(cell => {
        const trimmed = cell.trim();
        if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
        if (trimmed.endsWith(':')) return 'right';
        return 'left';
      });

    // Parse header cells
    const headerCells = headerRow
      .split('|')
      .filter(cell => cell.trim())
      .map((cell, i) => {
        const align = alignments[i] ? ` style="text-align: ${alignments[i]}"` : '';
        return `<th${align}>${cell.trim()}</th>`;
      })
      .join('');

    // Parse body rows
    const bodyHtml = bodyRows
      .trim()
      .split('\n')
      .map(row => {
        const cells = row
          .split('|')
          .filter(cell => cell.trim())
          .map((cell, i) => {
            const align = alignments[i] ? ` style="text-align: ${alignments[i]}"` : '';
            return `<td${align}>${cell.trim()}</td>`;
          })
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('\n');

    return `<table>
<thead>
<tr>${headerCells}</tr>
</thead>
<tbody>
${bodyHtml}
</tbody>
</table>`;
  });
}

/**
 * Parses horizontal rules
 * @private
 * @param {string} text - Markdown text
 * @returns {string} Text with horizontal rules converted
 */
function parseHorizontalRules(text) {
  return text.replace(/^(?:[-*_]){3,}\s*$/gm, '<hr>');
}

/**
 * Parses paragraphs
 * @private
 * @param {string} text - Markdown text
 * @param {ParseOptions} options - Parse options
 * @returns {string} Text with paragraphs wrapped
 */
function parseParagraphs(text, options) {
  // Split by double newlines
  const blocks = text.split(/\n\n+/);

  return blocks.map(block => {
    const trimmed = block.trim();

    // Skip if already an HTML block element
    if (/^<(div|p|h[1-6]|ul|ol|li|table|thead|tbody|tr|th|td|blockquote|pre|hr|img)/i.test(trimmed)) {
      return trimmed;
    }

    // Skip empty blocks
    if (!trimmed) {
      return '';
    }

    // Handle line breaks within paragraphs
    let content = trimmed;
    if (options.breaks) {
      content = content.replace(/\n/g, '<br>\n');
    }

    return `<p>${content}</p>`;
  }).join('\n\n');
}

/**
 * Applies typographic replacements
 * @private
 * @param {string} text - Text to process
 * @returns {string} Text with typographic replacements
 */
function applyTypographer(text) {
  // Smart quotes
  text = text.replace(/"([^"]+)"/g, '\u201c$1\u201d');
  text = text.replace(/'([^']+)'/g, '\u2018$1\u2019');

  // Dashes
  text = text.replace(/---/g, '\u2014'); // em dash
  text = text.replace(/--/g, '\u2013');  // en dash

  // Ellipsis
  text = text.replace(/\.\.\./g, '\u2026');

  return text;
}

/**
 * Sanitizes HTML output (basic removal of scripts and inline handlers)
 * @private
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
function sanitizeOutput(html) {
  let result = html;
  result = result.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  result = result.replace(/\son\w+="[^"]*"/gi, '');
  result = result.replace(/\son\w+='[^']*'/gi, '');
  result = result.replace(/(href|src)=["']javascript:[^"']*["']/gi, '$1="#"');
  return result;
}

/**
 * Parses markdown text to HTML
 * @param {string} markdown - Markdown text to parse
 * @param {ParseOptions} [options={}] - Parse options
 * @returns {string} HTML output
 * @example
 * const html = parse('# Hello World\n\nThis is **bold** text.');
 * // Returns: <h1 id="hello-world">Hello World</h1>\n\n<p>This is <strong>bold</strong> text.</p>
 *
 * @example
 * // With options
 * const html = parse(markdown, {
 *   breaks: true,
 *   linkify: true,
 *   taskLists: true
 * });
 */
export function parse(markdown, options = {}) {
  if (typeof markdown !== 'string') {
    throw new Error('Markdown input must be a string');
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  let text = markdown;

  // Normalize line endings
  text = text.replace(/\r\n/g, '\n');

  // Process in order to avoid conflicts
  text = parseCodeBlocks(text, opts);
  text = parseTables(text, opts);
  text = parseHeaders(text, opts);
  text = parseBlockquotes(text);
  text = parseHorizontalRules(text);
  text = parseLists(text, opts);
  text = parseLinksAndImages(text, opts);
  text = parseEmphasis(text);

  if (opts.typographer) {
    text = applyTypographer(text);
  }

  text = parseParagraphs(text, opts);

  if (opts.sanitize) {
    text = sanitizeOutput(text);
  }

  return text.trim();
}

/**
 * Parses inline markdown (no block elements)
 * @param {string} text - Inline markdown text
 * @param {ParseOptions} [options={}] - Parse options
 * @returns {string} HTML output
 * @example
 * const html = parseInline('This is **bold** and *italic* text.');
 * // Returns: This is <strong>bold</strong> and <em>italic</em> text.
 */
export function parseInline(text, options = {}) {
  if (typeof text !== 'string') {
    throw new Error('Text input must be a string');
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  let result = text;

  // Only inline elements
  result = result.replace(/`([^`\n]+)`/g, (match, code) => `<code>${escapeHtml(code)}</code>`);
  result = parseEmphasis(result);
  result = parseLinksAndImages(result, opts);

  if (opts.typographer) {
    result = applyTypographer(result);
  }

  return opts.sanitize ? sanitizeOutput(result) : result;
}

/**
 * Escapes HTML in text (utility function)
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 * @example
 * const safe = escape('<script>alert("xss")</script>');
 * // Returns: &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;
 */
export function escape(text) {
  if (typeof text !== 'string') {
    throw new Error('Text input must be a string');
  }
  return escapeHtml(text);
}

/**
 * Generates a table of contents from markdown
 * @param {string} markdown - Markdown text
 * @param {Object} [options={}] - Options
 * @param {number} [options.maxLevel=3] - Maximum heading level to include
 * @param {string} [options.prefix=''] - ID prefix for links
 * @returns {Array<{level: number, text: string, id: string}>} TOC entries
 * @example
 * const toc = generateTOC('# Title\n## Section 1\n## Section 2');
 * // Returns: [
 * //   { level: 1, text: 'Title', id: 'title' },
 * //   { level: 2, text: 'Section 1', id: 'section-1' },
 * //   { level: 2, text: 'Section 2', id: 'section-2' }
 * // ]
 */
export function generateTOC(markdown, options = {}) {
  if (typeof markdown !== 'string') {
    throw new Error('Markdown input must be a string');
  }

  const maxLevel = options.maxLevel || 3;
  const prefix = options.prefix || '';
  const toc = [];

  const headerRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;

  while ((match = headerRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    if (level <= maxLevel) {
      const text = match[2].trim();
      toc.push({
        level,
        text,
        id: slugify(text, prefix)
      });
    }
  }

  return toc;
}

/**
 * Renders table of contents as HTML
 * @param {Array<{level: number, text: string, id: string}>} toc - TOC entries
 * @returns {string} HTML list
 * @example
 * const tocHtml = renderTOC(generateTOC(markdown));
 */
export function renderTOC(toc) {
  if (!Array.isArray(toc)) {
    throw new Error('TOC must be an array');
  }

  if (toc.length === 0) {
    return '';
  }

  let html = '<nav class="toc"><ul>';
  let prevLevel = toc[0].level;

  for (const item of toc) {
    if (item.level > prevLevel) {
      html += '<ul>'.repeat(item.level - prevLevel);
    } else if (item.level < prevLevel) {
      html += '</li></ul>'.repeat(prevLevel - item.level) + '</li>';
    } else if (html !== '<nav class="toc"><ul>') {
      html += '</li>';
    }

    html += `<li><a href="#${item.id}">${escapeHtml(item.text)}</a>`;
    prevLevel = item.level;
  }

  html += '</li></ul>'.repeat(prevLevel - toc[0].level + 1);
  html += '</nav>';

  return html;
}

export default {
  parse,
  parseInline,
  escape,
  generateTOC,
  renderTOC
};
