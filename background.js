chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ "titles": [] });
});
/*
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Forward the message to the popup
    chrome.runtime.sendMessage(request);
});
*/