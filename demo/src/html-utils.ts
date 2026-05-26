export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function highlightAttributes(attrPart: string): string {
  let html = '';
  const attrRegex = /([\w-]+)(="([^"]*)")?/g;
  let match: RegExpExecArray | null;

  while ((match = attrRegex.exec(attrPart)) !== null) {
    html += ` <span class="attr">${escapeHtml(match[1])}</span>`;
    if (match[2] !== undefined) {
      html += `=<span class="val">&quot;${escapeHtml(match[3] ?? '')}&quot;</span>`;
    }
  }

  return html;
}

function highlightHtmlTag(tagSource: string): string {
  const inner = tagSource.slice(1, -1).trim();

  const closingMatch = inner.match(/^\/([\w-]+)$/);
  if (closingMatch) {
    return `<span class="tag">&lt;/${closingMatch[1]}&gt;</span>`;
  }

  const openMatch = inner.match(/^([\w-]+)([\s\S]*)$/);
  if (!openMatch) {
    return escapeHtml(tagSource);
  }

  const [, tagName, rest] = openMatch;
  const attrPart = rest.trim();

  if (!attrPart) {
    return `<span class="tag">&lt;${tagName}&gt;</span>`;
  }

  return `<span class="tag">&lt;${tagName}</span>${highlightAttributes(attrPart)}<span class="tag">&gt;</span>`;
}

function highlightHtmlLine(line: string): string {
  let result = '';
  let index = 0;

  while (index < line.length) {
    if (line.startsWith('<!--', index)) {
      const end = line.indexOf('-->', index);
      const comment = end === -1 ? line.slice(index) : line.slice(index, end + 3);
      result += `<span class="comment">${escapeHtml(comment)}</span>`;
      index += comment.length;
      continue;
    }

    if (line[index] === '<') {
      const closeIndex = line.indexOf('>', index);
      if (closeIndex === -1) {
        result += escapeHtml(line.slice(index));
        break;
      }

      result += highlightHtmlTag(line.slice(index, closeIndex + 1));
      index = closeIndex + 1;
      continue;
    }

    const nextTag = line.indexOf('<', index);
    const text = nextTag === -1 ? line.slice(index) : line.slice(index, nextTag);
    result += escapeHtml(text);
    index = nextTag === -1 ? line.length : nextTag;
  }

  return result;
}

export function highlightHtml(code: string): string {
  return code
    .trim()
    .split('\n')
    .map((line) => highlightHtmlLine(line))
    .join('\n');
}
