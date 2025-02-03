// Extract page information
const pageData = {
  title: document.title,
  url: window.location.href,
  headings: Array.from(document.querySelectorAll("h1, h2, h3")).map(h => h.innerText),
  paragraphs: Array.from(document.querySelectorAll("p")).map(p => p.innerText).slice(0, 5) // Limit to 5 paragraphs
};

// Send data to background script
chrome.runtime.sendMessage(
  {
    pageData: pageData
  }
);
