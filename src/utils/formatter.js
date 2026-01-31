/**
 * Format tabs data according to the specified format
 */
export function formatTabs(tabs, format, customTemplate = '') {
  switch (format) {
    case 'text':
      return formatAsText(tabs);
    case 'text-title':
      return formatAsTextWithTitle(tabs);
    case 'html':
      return formatAsHtml(tabs);
    case 'json':
      return formatAsJson(tabs);
    case 'markdown':
      return formatAsMarkdown(tabs);
    case 'custom':
      return formatAsCustom(tabs, customTemplate);
    default:
      return formatAsText(tabs);
  }
}

function formatAsText(tabs) {
  return tabs.map(tab => tab.url).join('\n');
}

function formatAsTextWithTitle(tabs) {
  return tabs.map(tab => `${tab.title}\n${tab.url}`).join('\n\n');
}

function formatAsHtml(tabs) {
  return tabs
    .map(tab => `<a href="${escapeHtml(tab.url)}">${escapeHtml(tab.title)}</a>`)
    .join('\n');
}

function formatAsJson(tabs) {
  const data = tabs.map(tab => ({
    title: tab.title,
    url: tab.url
  }));
  return JSON.stringify(data, null, 2);
}

function formatAsMarkdown(tabs) {
  return tabs.map(tab => `- [${tab.title}](${tab.url})`).join('\n');
}

function formatAsCustom(tabs, template) {
  if (!template) {
    template = '$url';
  }

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  return tabs.map(tab => {
    return template
      .replace(/\$url/g, tab.url)
      .replace(/\$title/g, tab.title)
      .replace(/\$date/g, dateStr);
  }).join('\n');
}

function escapeHtml(str) {
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => htmlEntities[char]);
}

/**
 * Extract URLs from text (for intelligent paste)
 */
export function extractUrls(text) {
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  const matches = text.match(urlPattern) || [];

  // Clean up URLs (remove trailing punctuation that might be captured)
  return matches.map(url => {
    return url.replace(/[.,;:!?)]+$/, '');
  }).filter((url, index, self) => {
    // Remove duplicates
    return self.indexOf(url) === index;
  });
}

/**
 * Validate if a string is a valid URL
 */
export function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
