/**
 * Offscreen document for clipboard operations
 * Required for Manifest V3 clipboard access from service worker
 */

const textarea = document.getElementById('clipboard');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'clipboard-write') {
    handleClipboardWrite(message.text)
      .then(() => sendResponse({ success: true }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === 'clipboard-read') {
    handleClipboardRead()
      .then(text => sendResponse(text))
      .catch(err => sendResponse(null));
    return true;
  }
});

async function handleClipboardWrite(text) {
  // Try modern API first
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // Fallback to execCommand
    textarea.value = text;
    textarea.select();
    document.execCommand('copy');
  }
}

async function handleClipboardRead() {
  // Try modern API first
  try {
    return await navigator.clipboard.readText();
  } catch {
    // Fallback to execCommand
    textarea.value = '';
    textarea.focus();
    document.execCommand('paste');
    return textarea.value;
  }
}
