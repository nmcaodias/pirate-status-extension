

document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("saveTitle");
    const titleList = document.getElementById("titleList");

    // Load saved titles
    chrome.storage.local.get("titles", function (data) {
        if (data.titles) {
            data.titles.forEach(title => addTitleToList(title));
        }
    });

    // Save title on button click
    saveButton.addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const pageTitle = tabs[0].title;
            
            /*
            // Listen for messages
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                console.log("Title:", request.pageData.title);
                console.log("URL:", request.pageData.url);
                console.log("Headings:", request.pageData.headings);
                console.log("Paragraphs:", request.pageData.paragraphs);
            });
            */
            setTimeout(() => {
                chrome.runtime.sendMessage({ action: "fetchPageData" }, (response) => {
                    if (response) {
                        console.log("Title:", response.title);
                        console.log("URL:", response.url);
                        console.log("Headings:", response.headings);
                        console.log("Paragraphs:", response.paragraphs);
                    }
                });
            }, 500);
            
            chrome.storage.local.get("titles", function (data) {
                const titles = data.titles || [];
                titles.push(pageTitle);
                chrome.storage.local.set({ "titles": titles }, function () {
                    addTitleToList(pageTitle);
                });
            });

        
        });
    });

    function addTitleToList(title) {
        const li = document.createElement("li");
        li.textContent = title;
        titleList.appendChild(li);
    }
});