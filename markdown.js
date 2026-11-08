// Small, dependency-free Markdown renderer. Raw HTML is always text.
(() => {
  'use strict';
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function safeUrl(value) {
    try {
      const url = new URL(value);
      return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  }
  function inline(value, depth = 0) {
    const text = String(value);
    if (depth > 8) return escape(text);
    let html = '', i = 0;
    while (i < text.length) {
      if (text[i] === '\\' && i + 1 < text.length && /[\\`*_{}\[\]()#+.!>~|\-]/.test(text[i + 1])) {
        html += escape(text[i + 1]); i += 2; continue;
      }
      if (text[i] === '`') {
        const fence = text.slice(i).match(/^`+/)[0], end = text.indexOf(fence, i + fence.length);
        if (end !== -1) {
          html += '<code>' + escape(text.slice(i + fence.length, end).replace(/\n/g, ' ')) + '</code>';
          i = end + fence.length; continue;
        }
      }
      if (text[i] === '[') {
        const labelEnd = text.indexOf('](', i + 1);
        if (labelEnd !== -1) {
          let end = labelEnd + 2, balance = 1;
          while (end < text.length && balance) {
            if (text[end] === '(') balance++;
            if (text[end] === ')') balance--;
            if (balance) end++;
          }
          if (!balance) {
            const label = text.slice(i + 1, labelEnd), rawUrl = text.slice(labelEnd + 2, end).trim();
            const href = safeUrl(rawUrl.startsWith('<') && rawUrl.endsWith('>') ? rawUrl.slice(1, -1) : rawUrl);
            if (href) {
              html += '<a href="' + escape(href) + '" target="_blank" rel="noopener noreferrer">' + inline(label, depth + 1) + '</a>';
              i = end + 1; continue;
            }
          }
        }
      }
      const delimiter = ['**', '__', '~~', '*', '_'].find(mark => text.startsWith(mark, i));
      if (delimiter && !(delimiter.includes('_') && /[\p{L}\p{N}]/u.test(text[i - 1] || ''))) {
        const end = text.indexOf(delimiter, i + delimiter.length), content = text.slice(i + delimiter.length, end);
        if (end > i + delimiter.length && !/^\s|\s$/.test(content)) {
          const tag = delimiter === '~~' ? 'del' : delimiter.length === 2 ? 'strong' : 'em';
          html += '<' + tag + '>' + inline(content, depth + 1) + '</' + tag + '>';
          i = end + delimiter.length; continue;
        }
      }
      html += text[i] === '\n' ? '<br>' : escape(text[i]);
      i++;
    }
    return html;
  }
  const listMatch = line => /^(\s*)([-+*]|\d+[.)])\s+(.+)$/.exec(line);
  const tableCells = line => line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(cell => cell.trim());
  const tableDivider = line => line.includes('|') && tableCells(line).every(cell => /^:?-{3,}:?$/.test(cell));
  const fenceMatch = line => /^\s{0,3}(`{3,}|~{3,})\s*([\w+-]*)[^\n]*$/.exec(line);
  const beginsBlock = line => !line.trim() || fenceMatch(line) || /^\s{0,3}(#{1,6})\s+|^\s{0,3}>\s?|^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line) || listMatch(line);
  function blocks(lines, depth = 0) {
    if (depth > 12) return '<p>' + inline(lines.join('\n')) + '</p>';
    let html = '', i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      const fence = fenceMatch(line);
      if (fence) {
        const code = []; i++;
        const closing = new RegExp('^\\s{0,3}' + (fence[1][0] === '`' ? '`' : '~') + '{' + fence[1].length + ',}\\s*$');
        while (i < lines.length && !closing.test(lines[i])) code.push(lines[i++]);
        if (i < lines.length) i++;
        const language = fence[2] ? ' class="language-' + escape(fence[2]) + '"' : '';
        html += '<pre><code' + language + '>' + escape(code.join('\n')) + '</code></pre>'; continue;
      }
      const heading = /^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
      if (heading) { const tag = 'h' + heading[1].length; html += '<' + tag + '>' + inline(heading[2]) + '</' + tag + '>'; i++; continue; }
      if (/^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { html += '<hr>'; i++; continue; }
      if (/^\s{0,3}>/.test(line)) {
        const quote = [];
        while (i < lines.length && /^\s{0,3}>/.test(lines[i])) quote.push(lines[i++].replace(/^\s{0,3}>\s?/, ''));
        html += '<blockquote>' + blocks(quote, depth + 1) + '</blockquote>'; continue;
      }
      if (i + 1 < lines.length && line.includes('|') && tableDivider(lines[i + 1])) {
        const headers = tableCells(line); i += 2;
        html += '<div class="ai-table-wrap"><table><thead><tr>' + headers.map(cell => '<th>' + inline(cell) + '</th>').join('') + '</tr></thead><tbody>';
        while (i < lines.length && lines[i].trim() && lines[i].includes('|')) {
          const cells = tableCells(lines[i++]);
          html += '<tr>' + headers.map((_, index) => '<td>' + inline(cells[index] || '') + '</td>').join('') + '</tr>';
        }
        html += '</tbody></table></div>'; continue;
      }
      const first = listMatch(line);
      if (first) {
        const ordered = /^\d/.test(first[2]), tag = ordered ? 'ol' : 'ul', indent = first[1].length;
        const start = ordered ? Number.parseInt(first[2], 10) : 1;
        html += '<' + tag + (ordered && start !== 1 ? ' start="' + start + '"' : '') + '>';
        while (i < lines.length) {
          const entry = listMatch(lines[i]);
          if (!entry || entry[1].length !== indent || /^\d/.test(entry[2]) !== ordered) break;
          const body = [entry[3]]; i++;
          while (i < lines.length && lines[i].trim() && /^\s+/.test(lines[i]) && (!listMatch(lines[i]) || listMatch(lines[i])[1].length > indent)) {
            body.push(lines[i++].slice(Math.min(indent + 2, lines[i - 1].search(/\S/))));
          }
          html += '<li>' + (body.length === 1 ? inline(body[0]) : blocks(body, depth + 1)) + '</li>';
        }
        html += '</' + tag + '>'; continue;
      }
      const paragraph = [line]; i++;
      while (i < lines.length && !beginsBlock(lines[i]) && !(i + 1 < lines.length && lines[i].includes('|') && tableDivider(lines[i + 1]))) paragraph.push(lines[i++]);
      html += '<p>' + inline(paragraph.join('\n')) + '</p>';
    }
    return html;
  }
  window.AtlasMarkdown = Object.freeze({render(text) { return blocks(String(text ?? '').replace(/\r\n?/g, '\n').split('\n')); }});
})();
