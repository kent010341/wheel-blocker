/**
 * Check if the current URL is in the whitelist, adjust the button text/color accordingly,
 * and update the status display on the popup.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Get the current tab's URL
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentURL = new URL(tabs[0].url).hostname;
    document.getElementById('current-url').textContent = currentURL;

    // Check if the current URL is in the whitelist
    browser.runtime.sendMessage({ action: "isInWhitelist", url: currentURL }, (response) => {
      const isInWhitelist = response.isInWhitelist;
      const toggleButton = document.getElementById('toggle-whitelist');
      const statusElement = document.getElementById('status');

      // Update button text, color, and status message based on whether the URL is in the whitelist
      updateButtonAndStatus(isInWhitelist, toggleButton, statusElement, currentURL);
    });

    // Handle click event on the toggle button to add/remove the URL from the whitelist
    document.getElementById('toggle-whitelist').addEventListener('click', () => {
      browser.runtime.sendMessage({ action: "isInWhitelist", url: currentURL }, (response) => {
        const isInWhitelist = response.isInWhitelist;
        const toggleButton = document.getElementById('toggle-whitelist');
        const statusElement = document.getElementById('status');

        if (isInWhitelist) {
          // Remove from whitelist
          browser.runtime.sendMessage({ action: "remove", url: currentURL }, () => {
            console.log(`URL removed from whitelist: ${currentURL}`);
            updateButtonAndStatus(false, toggleButton, statusElement, currentURL);
          });
        } else {
          // Add to whitelist
          browser.runtime.sendMessage({ action: "add", url: currentURL }, () => {
            console.log(`URL added to whitelist: ${currentURL}`);
            updateButtonAndStatus(true, toggleButton, statusElement, currentURL);
          });
        }
      });
    });

    // Display the current whitelist
    document.getElementById('show-whitelist').addEventListener('click', () => {
      browser.runtime.sendMessage({ action: "getWhitelist" }, (response) => {
        const outputDiv = document.getElementById('output');
        outputDiv.textContent = response.whitelist.length
          ? `Whitelisted URLs:\n${response.whitelist.join('\n')}`
          : "The whitelist is currently empty.";
      });
    });
  });
});

/**
 * Update the button text, color, and status message based on the whitelist status.
 * @param {boolean} isInWhitelist - Whether the current URL is in the whitelist.
 * @param {HTMLElement} button - The button element to update.
 * @param {HTMLElement} statusElement - The element to display the status message.
 * @param {string} url - The current URL.
 */
function updateButtonAndStatus(isInWhitelist, button, statusElement, url) {
  if (isInWhitelist) {
    button.textContent = "Remove from Whitelist";
    button.style.backgroundColor = "#e74c3c"; // Red color for 'remove'
    statusElement.textContent = "This URL is in the whitelist.";
    statusElement.style.color = "green"; // Green text for positive status
  } else {
    button.textContent = "Add to Whitelist";
    button.style.backgroundColor = "#4CAF50"; // Green color for 'add'
    statusElement.textContent = "This URL is not in the whitelist.";
    statusElement.style.color = "red"; // Red text for negative status
  }
}
