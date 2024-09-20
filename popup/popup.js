/**
 * Get the current tab's URL and allow the user to add or remove it from the whitelist.
 */
document.addEventListener('DOMContentLoaded', () => {
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentURL = new URL(tabs[0].url).hostname;
    document.getElementById('current-url').textContent = currentURL;

    // Add current URL to whitelist
    document.getElementById('add').addEventListener('click', () => {
      browser.runtime.sendMessage({ action: "add", url: currentURL });
    });

    // Remove current URL from whitelist
    document.getElementById('remove').addEventListener('click', () => {
      browser.runtime.sendMessage({ action: "remove", url: currentURL });
    });
  });
});
