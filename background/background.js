/**
 * Add the current site to the whitelist stored in browser's local storage.
 * Logs the addition action.
 * @param {string} url - The URL of the website to be added to the whitelist.
 */
function addToWhitelist(url) {
  browser.storage.local.get("whitelist", (result) => {
    let whitelist = result.whitelist || [];
    if (!whitelist.includes(url)) {
      whitelist.push(url);
      browser.storage.local.set({ whitelist: whitelist }, () => {
        console.debug(`Added to whitelist: ${url}`);
      });
    }
  });
}

/**
 * Remove the current site from the whitelist stored in browser's local storage.
 * Logs the removal action.
 * @param {string} url - The URL of the website to be removed from the whitelist.
 */
function removeFromWhitelist(url) {
  browser.storage.local.get("whitelist", (result) => {
    let whitelist = result.whitelist || [];
    whitelist = whitelist.filter(item => item !== url);
    browser.storage.local.set({ whitelist: whitelist }, () => {
      console.debug(`Removed from whitelist: ${url}`);
    });
  });
}

/**
 * Get the current whitelist.
 * @param {function} callback - Callback function to handle the retrieved whitelist.
 */
function getWhitelist(callback) {
  browser.storage.local.get("whitelist", (result) => {
    callback(result.whitelist || []);
  });
}

// Listener for messages from the popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "add") {
    addToWhitelist(message.url);
  } else if (message.action === "remove") {
    removeFromWhitelist(message.url);
  } else if (message.action === "getWhitelist") {
    getWhitelist((whitelist) => sendResponse({ whitelist: whitelist }));
    return true; // This line keeps the message channel open for async response
  } else if (message.action === "isInWhitelist") {
    getWhitelist((whitelist) => {
      const isInList = whitelist.includes(message.url);
      sendResponse({ isInWhitelist: isInList });
    });
    return true; // Keeps the message channel open
  }
});
