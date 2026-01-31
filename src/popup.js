import { formatTabs, extractUrls } from './utils/formatter.js';
import { getSettings, saveSetting } from './utils/storage.js';
import { localizeHtmlPage, getTabCountMessage, getMessage } from './utils/i18n.js';

// DOM Elements
const copyBtn = document.getElementById('copyBtn');
const pasteBtn = document.getElementById('pasteBtn');
const formatSelect = document.getElementById('formatSelect');
const optionsBtn = document.getElementById('optionsBtn');
const tabCountEl = document.getElementById('tabCount');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  // Apply localization
  localizeHtmlPage();

  await loadSettings();
  await updateTabCount();

  // Event listeners
  copyBtn.addEventListener('click', handleCopy);
  pasteBtn.addEventListener('click', handlePaste);
  optionsBtn.addEventListener('click', openOptions);

  // Save settings on change
  formatSelect.addEventListener('change', () => saveSetting('defaultFormat', formatSelect.value));
}

async function loadSettings() {
  const settings = await getSettings();
  formatSelect.value = settings.defaultFormat;
}

async function updateTabCount() {
  const tabs = await getTabs();
  const count = tabs.length;
  tabCountEl.textContent = getTabCountMessage(count);
}

async function getTabs() {
  const settings = await getSettings();
  const queryOptions = {};

  // Use settings from options page
  if (!settings.copyAllWindows) {
    queryOptions.currentWindow = true;
  }

  if (settings.copyHighlightedOnly) {
    queryOptions.highlighted = true;
  }

  return chrome.tabs.query(queryOptions);
}

async function handleCopy() {
  try {
    const tabs = await getTabs();

    if (tabs.length === 0) {
      showNotification(getMessage('notificationNoTabs'), true);
      return;
    }

    const settings = await getSettings();
    const format = formatSelect.value;
    const formatted = formatTabs(tabs, format, settings.customTemplate);

    await navigator.clipboard.writeText(formatted);

    showNotification(getMessage('notificationCopied', [tabs.length.toString()]));
  } catch (error) {
    console.error('Copy failed:', error);
    showNotification(getMessage('notificationCopyFailed'), true);
  }
}

async function handlePaste() {
  try {
    const text = await navigator.clipboard.readText();

    if (!text || text.trim() === '') {
      showNotification(getMessage('notificationClipboardEmpty'), true);
      return;
    }

    // Extract URLs from clipboard content
    const urls = extractUrls(text);

    if (urls.length === 0) {
      showNotification(getMessage('notificationNoUrls'), true);
      return;
    }

    // Open each URL in a new tab
    for (const url of urls) {
      await chrome.tabs.create({ url, active: false });
    }

    showNotification(getMessage('notificationOpened', [urls.length.toString()]));
  } catch (error) {
    console.error('Paste failed:', error);
    showNotification(getMessage('notificationPasteFailed'), true);
  }
}

function openOptions() {
  chrome.runtime.openOptionsPage();
}

function showNotification(message, isError = false) {
  notificationText.textContent = message;
  notification.classList.remove('error');
  if (isError) {
    notification.classList.add('error');
  }
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}
