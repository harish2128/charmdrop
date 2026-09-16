/**
 * CharmDrop - Manifest V3 Background Service Worker
 */

const DEFAULT_SETTINGS = {
  enabled: true,
  selectedCharmId: 'nimbu-mirchi',
  positionMode: 'top-right', // 'top-left' | 'top-center' | 'top-right' | 'custom'
  customPercentX: 85, // Horizontal viewport position percentage (0..100)
  soundEffectsEnabled: true,
  dailyState: {
    lastHangDate: new Date().toDateString(),
    isFresh: true
  }
};

chrome.runtime.onInstalled.addListener(async (details) => {
  try {
    const existing = await chrome.storage.local.get(null);
    const toSet = {};

    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      if (existing[key] === undefined) {
        toSet[key] = value;
      }
    }

    if (Object.keys(toSet).length > 0) {
      await chrome.storage.local.set(toSet);
    }
  } catch (err) {
    // Ignore storage init error
  }
});

// Broadcast messages to all active tabs
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'GET_EXTENSION_DATA') {
    chrome.storage.local.get(null).then((data) => {
      sendResponse({ status: 'ok', data: { ...DEFAULT_SETTINGS, ...data } });
    });
    return true; // async sendResponse
  }
});
