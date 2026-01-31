import { getSettings, saveSettings, checkStorageHealth, resetSettings } from './utils/storage.js';
import { localizeHtmlPage, getMessage } from './utils/i18n.js';

// DOM Elements
const defaultActionRadios = document.querySelectorAll('input[name="defaultAction"]');
const defaultFormat = document.getElementById('defaultFormat');
const customTemplate = document.getElementById('customTemplate');
const templatePreview = document.getElementById('templatePreview');
const copyHighlightedOnly = document.getElementById('copyHighlightedOnly');
const copyAllWindows = document.getElementById('copyAllWindows');
const showNotifications = document.getElementById('showNotifications');
const openShortcutsBtn = document.getElementById('openShortcuts');
const resetSettingsBtn = document.getElementById('resetSettings');
const storageStatus = document.getElementById('storageStatus');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  // Apply localization
  localizeHtmlPage();

  await loadSettings();
  await checkStorage();
  setupEventListeners();
  updateTemplatePreview();
}

async function loadSettings() {
  const settings = await getSettings();

  // Set default action
  defaultActionRadios.forEach(radio => {
    radio.checked = radio.value === settings.defaultAction;
  });

  // Set other values
  defaultFormat.value = settings.defaultFormat;
  customTemplate.value = settings.customTemplate;
  copyHighlightedOnly.checked = settings.copyHighlightedOnly;
  copyAllWindows.checked = settings.copyAllWindows;
  showNotifications.checked = settings.showNotifications;
}

function setupEventListeners() {
  // Default action
  defaultActionRadios.forEach(radio => {
    radio.addEventListener('change', handleSettingsChange);
  });

  // Other settings
  defaultFormat.addEventListener('change', handleSettingsChange);
  customTemplate.addEventListener('input', () => {
    updateTemplatePreview();
    handleSettingsChange();
  });
  copyHighlightedOnly.addEventListener('change', handleSettingsChange);
  copyAllWindows.addEventListener('change', handleSettingsChange);
  showNotifications.addEventListener('change', handleSettingsChange);

  // Buttons
  openShortcutsBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  });

  resetSettingsBtn.addEventListener('click', handleReset);
}

async function handleSettingsChange() {
  const settings = {
    defaultAction: document.querySelector('input[name="defaultAction"]:checked').value,
    defaultFormat: defaultFormat.value,
    customTemplate: customTemplate.value,
    copyHighlightedOnly: copyHighlightedOnly.checked,
    copyAllWindows: copyAllWindows.checked,
    showNotifications: showNotifications.checked
  };

  const success = await saveSettings(settings);
  if (success) {
    showNotificationMessage(getMessage('optionsSaved'));
  } else {
    showNotificationMessage(getMessage('optionsSaveFailed'), true);
  }
}

function updateTemplatePreview() {
  const template = customTemplate.value || '$url';
  const preview = template
    .replace(/\$url/g, 'https://example.com')
    .replace(/\$title/g, getMessage('optionsPreviewTitle'))
    .replace(/\$date/g, new Date().toISOString().split('T')[0]);
  templatePreview.textContent = preview;
}

async function checkStorage() {
  const health = await checkStorageHealth();

  if (health.sync && health.local) {
    storageStatus.textContent = getMessage('optionsStorageHealthy');
    storageStatus.className = 'storage-status healthy';
  } else if (health.sync || health.local) {
    const working = health.sync ? 'sync' : 'local';
    storageStatus.textContent = getMessage('optionsStoragePartial', [working]);
    storageStatus.className = 'storage-status warning';
  } else {
    storageStatus.textContent = getMessage('optionsStorageError');
    storageStatus.className = 'storage-status error';
  }
}

async function handleReset() {
  if (confirm(getMessage('optionsResetConfirm'))) {
    await resetSettings();
    await loadSettings();
    updateTemplatePreview();
    showNotificationMessage(getMessage('optionsResetDone'));
  }
}

function showNotificationMessage(message, isError = false) {
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
