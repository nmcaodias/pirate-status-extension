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
