document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup.js loaded - adding listener to dropdown.");
  const dropdown = document.getElementById("voiceSelect");

  // Load saved dropdown value
  chrome.storage.local.get(['selectedVoice'], (result) => {
    console.log("Popup.js - reading local storage.");
    if (result.selectedVoice) {
      dropdown.value = result.selectedVoice;
    }
  });

  // Save the selected voice when changed
  dropdown.addEventListener("change", () => {
    console.log("Popup.js - dropdown change event triggered. Setting local storage.");
    const selectedVoice = dropdown.value;
    chrome.storage.local.set({ selectedVoice });
  });
});
