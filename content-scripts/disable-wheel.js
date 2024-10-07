/**
 * Disable mouse wheel scroll on all input fields on the current page.
 */
function disableWheelForAllInputs() {
  const inputs = document.querySelectorAll('input');

  inputs.forEach(input => {
    if (!input.dataset.wheelDisabled) { // Prevent adding the listener multiple times
      input.addEventListener('wheel', function(e) {
        e.preventDefault();
      });
      input.dataset.wheelDisabled = "true"; // Mark this input as processed
    }
  });
}

/**
 * Observe DOM changes and apply the disableWheelForAllInputs function
 * to any new input elements that are added.
 */
function observeNewInputs() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Ensure it's an element node
            if (node.tagName === 'INPUT') {
              disableWheelForAllInputs();
            } else {
              // Check for any child input elements if the added node is a container
              const nestedInputs = node.querySelectorAll('input');
              if (nestedInputs.length > 0) {
                disableWheelForAllInputs();
              }
            }
          }
        });
      }
    }
  });

  // Start observing the entire document for changes
  observer.observe(document.body, { childList: true, subtree: true });
}

// Initially disable wheel for any existing input element
disableWheelForAllInputs();

// Start observing for any new elements added
observeNewInputs();
