/**
 * Internationalization utility functions
 */

/**
 * Get a localized message
 * @param {string} messageName - The message key from messages.json
 * @param {string|string[]} substitutions - Optional substitution values
 * @returns {string} The localized message
 */
export function getMessage(messageName, substitutions) {
  return chrome.i18n.getMessage(messageName, substitutions) || messageName;
}

/**
 * Apply i18n to all elements with data-i18n attribute
 */
export function localizeHtmlPage() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const messageName = element.getAttribute('data-i18n');
    const message = getMessage(messageName);
    if (message) {
      element.textContent = message;
    }
  });

  // Update page title if it has data-i18n
  const titleElement = document.querySelector('title[data-i18n]');
  if (titleElement) {
    const messageName = titleElement.getAttribute('data-i18n');
    const message = getMessage(messageName);
    if (message) {
      document.title = message;
    }
  }
}

/**
 * Get localized tab count string
 * @param {number} count - Number of tabs
 * @returns {string} Localized tab count
 */
export function getTabCountMessage(count) {
  return getMessage('tabCount', [count.toString()]);
}

/**
 * Get localized notification messages
 */
export function getNotificationCopyMessage(count) {
  return getMessage('notificationCopyMessage', [count.toString()]);
}

export function getNotificationPasteMessage(count) {
  return getMessage('notificationPasteMessage', [count.toString()]);
}

export function getNotificationNoUrlsMessage() {
  return getMessage('notificationNoUrls');
}
