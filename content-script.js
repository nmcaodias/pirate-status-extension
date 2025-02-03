chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchPageData") {
      try {
          const pageData = {
              title: document.title,
              url: window.location.href,
              headings: Array.from(document.querySelectorAll("h1, h2, h3")).map(h => h.innerText),
              paragraphs: Array.from(document.querySelectorAll("p")).map(p => p.innerText).slice(0, 5)
          };

          sendResponse(pageData); // Always send a response
      } catch (error) {
          console.error("Error fetching page data:", error);
          sendResponse({ error: "Failed to fetch page data." }); // Send error response
      }
  }
  return true; // Keep the channel open for async response
});
