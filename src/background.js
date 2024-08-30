chrome.action.onClicked.addListener((tab) => {
  console.log("Extension icon clicked");
  chrome.tabs.sendMessage(tab.id, { action: "toggleReaderMode" });
});
