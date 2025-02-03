chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ "titles": [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchPageData") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                sendResponse({ error: "No active tab found" });
                return;
            }

            let tabId = tabs[0].id;

            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["content-script.js"]
            }, () => {
                chrome.tabs.sendMessage(tabId, request, sendResponse);
            });
        });

        return true; // ✅ Keep sendResponse open
    }
});


