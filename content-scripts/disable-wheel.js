/**
 * Disable mouse wheel scroll on all number input fields on the current page.
 */
function disableWheelForNumberInputs() {
  document.querySelectorAll('input[type=number]').forEach(input => {
    input.addEventListener('wheel', function(e) {
      e.preventDefault();
    });
  });
}

/**
 * Check if the current site is in the whitelist, and disable mouse wheel
 * scrolling on number inputs if it is.
 */
browser.storage.local.get("whitelist", (result) => {
  const whitelist = result.whitelist || [];
  const currentURL = window.location.hostname;

  // If the current site is whitelisted, disable the wheel scroll on number inputs
  if (whitelist.includes(currentURL)) {
    disableWheelForNumberInputs();
  }
});
