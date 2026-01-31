/**
 * Storage utility with fallback mechanism
 */

const DEFAULT_SETTINGS = {
  defaultAction: 'menu', // 'menu', 'copy', 'paste'
  defaultFormat: 'text',
  copyHighlightedOnly: false,
  copyAllWindows: false,
  customTemplate: '$url',
  showNotifications: true
};

/**
 * Get settings from storage with fallback
 */
export async function getSettings() {
  try {
    // Try sync storage first
    const syncData = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS, ...syncData };
  } catch (syncError) {
    console.warn('Sync storage failed, trying local storage:', syncError);
    try {
      // Fallback to local storage
      const localData = await chrome.storage.local.get(DEFAULT_SETTINGS);
      return { ...DEFAULT_SETTINGS, ...localData };
    } catch (localError) {
      console.error('Local storage also failed:', localError);
      return DEFAULT_SETTINGS;
    }
  }
}

/**
 * Save settings to storage
 */
export async function saveSettings(settings) {
  const dataToSave = { ...settings };

  try {
    // Try to save to both sync and local
    await Promise.all([
      chrome.storage.sync.set(dataToSave).catch(err => {
        console.warn('Failed to save to sync storage:', err);
      }),
      chrome.storage.local.set(dataToSave).catch(err => {
        console.warn('Failed to save to local storage:', err);
      })
    ]);
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
}

/**
 * Get a single setting value
 */
export async function getSetting(key) {
  const settings = await getSettings();
  return settings[key];
}

/**
 * Save a single setting value
 */
export async function saveSetting(key, value) {
  const settings = await getSettings();
  settings[key] = value;
  return saveSettings(settings);
}

/**
 * Check storage health
 */
export async function checkStorageHealth() {
  const results = {
    sync: false,
    local: false
  };

  try {
    await chrome.storage.sync.set({ _healthCheck: Date.now() });
    await chrome.storage.sync.remove('_healthCheck');
    results.sync = true;
  } catch (e) {
    console.warn('Sync storage health check failed:', e);
  }

  try {
    await chrome.storage.local.set({ _healthCheck: Date.now() });
    await chrome.storage.local.remove('_healthCheck');
    results.local = true;
  } catch (e) {
    console.warn('Local storage health check failed:', e);
  }

  return results;
}

/**
 * Reset settings to defaults
 */
export async function resetSettings() {
  return saveSettings(DEFAULT_SETTINGS);
}
