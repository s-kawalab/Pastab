/**
 * PASTY - Background Service Worker
 * Handles keyboard shortcuts and background operations
 */

// Default settings
const DEFAULT_SETTINGS = {
  defaultAction: 'menu',
  defaultFormat: 'text',
  copyHighlightedOnly: false,
  copyAllWindows: false,
  customTemplate: '$url',
  showNotifications: true
};

// Initialize popup based on settings
chrome.runtime.onInstalled.addListener(async () => {
  await updatePopupBehavior();
});

// Also check on startup
chrome.runtime.onStartup.addListener(async () => {
  await updatePopupBehavior();
});

// Listen for storage changes to update popup behavior
chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (changes.defaultAction) {
    await updatePopupBehavior();
  }
});

// Update popup behavior based on defaultAction setting
async function updatePopupBehavior() {
  const settings = await getSettings();

  if (settings.defaultAction === 'menu') {
    // Show popup on click
    await chrome.action.setPopup({ popup: 'popup.html' });
  } else {
    // Disable popup to allow onClicked event
    await chrome.action.setPopup({ popup: '' });
  }
}

// Handle action button click (only fires when popup is disabled)
chrome.action.onClicked.addListener(async (tab) => {
  const settings = await getSettings();

  if (settings.defaultAction === 'copy') {
    await handleCopyCommand();
  } else if (settings.defaultAction === 'paste') {
    await handlePasteCommand();
  }
});

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'copy-urls') {
    await handleCopyCommand();
  } else if (command === 'paste-urls') {
    await handlePasteCommand();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'copy') {
    handleCopyCommand().then(sendResponse);
    return true;
  } else if (message.action === 'paste') {
    handlePasteCommand().then(sendResponse);
    return true;
  }
});

async function getSettings() {
  try {
    const data = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS, ...data };
  } catch {
    try {
      const data = await chrome.storage.local.get(DEFAULT_SETTINGS);
      return { ...DEFAULT_SETTINGS, ...data };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
}

async function handleCopyCommand() {
  try {
    const settings = await getSettings();
    const tabs = await getTabs(settings);

    if (tabs.length === 0) {
      showNotification('コピーするタブがありません', 'error');
      return { success: false, error: 'No tabs' };
    }

    const formatted = formatTabs(tabs, settings.defaultFormat, settings.customTemplate);

    // Copy to clipboard using offscreen document
    await copyToClipboard(formatted);

    if (settings.showNotifications) {
      showNotification(`${tabs.length}件のURLをコピーしました`);
    }

    return { success: true, count: tabs.length };
  } catch (error) {
    console.error('Copy failed:', error);
    showNotification('コピーに失敗しました', 'error');
    return { success: false, error: error.message };
  }
}

async function handlePasteCommand() {
  try {
    const settings = await getSettings();

    // Get clipboard content
    const text = await readFromClipboard();

    if (!text || text.trim() === '') {
      showNotification('クリップボードが空です', 'error');
      return { success: false, error: 'Clipboard empty' };
    }

    const urls = extractUrls(text);

    if (urls.length === 0) {
      showNotification('URLが見つかりませんでした', 'error');
      return { success: false, error: 'No URLs' };
    }

    for (const url of urls) {
      await chrome.tabs.create({ url, active: false });
    }

    if (settings.showNotifications) {
      showNotification(`${urls.length}件のタブを開きました`);
    }

    return { success: true, count: urls.length };
  } catch (error) {
    console.error('Paste failed:', error);
    showNotification('ペーストに失敗しました', 'error');
    return { success: false, error: error.message };
  }
}

async function getTabs(settings) {
  const queryOptions = {};

  if (!settings.copyAllWindows) {
    queryOptions.currentWindow = true;
  }

  if (settings.copyHighlightedOnly) {
    queryOptions.highlighted = true;
  }

  return chrome.tabs.query(queryOptions);
}

function formatTabs(tabs, format, customTemplate) {
  switch (format) {
    case 'text':
      return tabs.map(tab => tab.url).join('\n');
    case 'text-title':
      return tabs.map(tab => `${tab.title}\n${tab.url}`).join('\n\n');
    case 'html':
      return tabs.map(tab =>
        `<a href="${escapeHtml(tab.url)}">${escapeHtml(tab.title)}</a>`
      ).join('\n');
    case 'json':
      return JSON.stringify(tabs.map(tab => ({
        title: tab.title,
        url: tab.url
      })), null, 2);
    case 'markdown':
      return tabs.map(tab => `- [${tab.title}](${tab.url})`).join('\n');
    case 'custom':
      const dateStr = new Date().toISOString().split('T')[0];
      return tabs.map(tab =>
        (customTemplate || '$url')
          .replace(/\$url/g, tab.url)
          .replace(/\$title/g, tab.title)
          .replace(/\$date/g, dateStr)
      ).join('\n');
    default:
      return tabs.map(tab => tab.url).join('\n');
  }
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

function extractUrls(text) {
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  const matches = text.match(urlPattern) || [];

  return matches
    .map(url => url.replace(/[.,;:!?)]+$/, ''))
    .filter((url, index, self) => self.indexOf(url) === index);
}

// Clipboard operations using execCommand (works in service worker context via offscreen)
let creatingOffscreen;

async function setupOffscreenDocument() {
  const offscreenUrl = 'offscreen.html';
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [chrome.runtime.getURL(offscreenUrl)]
  });

  if (existingContexts.length > 0) {
    return;
  }

  if (creatingOffscreen) {
    await creatingOffscreen;
  } else {
    creatingOffscreen = chrome.offscreen.createDocument({
      url: offscreenUrl,
      reasons: ['CLIPBOARD'],
      justification: 'Read/write clipboard'
    });
    await creatingOffscreen;
    creatingOffscreen = null;
  }
}

async function copyToClipboard(text) {
  await setupOffscreenDocument();
  await chrome.runtime.sendMessage({
    type: 'clipboard-write',
    text: text
  });
}

async function readFromClipboard() {
  await setupOffscreenDocument();
  const response = await chrome.runtime.sendMessage({
    type: 'clipboard-read'
  });
  return response;
}

function showNotification(message, type = 'success') {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Pastab',
    message: message
  });
}
