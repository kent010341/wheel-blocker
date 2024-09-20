/**
 * Add the current site to the whitelist stored in browser's local storage.
 * @param {string} url - The URL of the website to be added to the whitelist.
 */
function addToWhitelist(url) {
  browser.storage.local.get("whitelist", (result) => {
    let whitelist = result.whitelist || [];
    if (!whitelist.includes(url)) {
      whitelist.push(url);
      browser.storage.local.set({ whitelist: whitelist });
    }
  });
}

/**
 * Remove the current site from the whitelist stored in browser's local storage.
 * @param {string} url - The URL of the website to be removed from the whitelist.
 */
function removeFromWhitelist(url) {
  browser.storage.local.get("whitelist", (result) => {
    let whitelist = result.whitelist || [];
    whitelist = whitelist.filter(item => item !== url);
    browser.storage.local.set({ whitelist: whitelist });
  });
}

// Listener for messages from the popup to add or remove websites from the whitelist
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "add") {
    addToWhitelist(message.url);
  } else if (message.action === "remove") {
    removeFromWhitelist(message.url);
  }
});
