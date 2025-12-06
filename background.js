// Listen for extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  // Don't run on chrome:// pages
  if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
    return;
  }

  try {
    // Send message to content script to toggle the bubble
    await chrome.tabs.sendMessage(tab.id, { action: "toggleBubble" });
  } catch (error) {
    // Content script might not be loaded, inject it first
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      // Wait a moment then try again
      setTimeout(async () => {
        await chrome.tabs.sendMessage(tab.id, { action: "toggleBubble" });
      }, 100);
    } catch (e) {
      console.error('Could not inject content script:', e);
    }
  }
});

