

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

            chrome.runtime.sendMessage({ action: "fetchPageData" }, (response) => {

                if (response) {
                    console.log("Title:", response.title);
                    console.log("URL:", response.url);
                    console.log("Show Type:", response.showType);

                    const title = response.title;
                    const url = response.url;
                    const showType = response.showType;
                    
                    chrome.storage.local.get("titles", function (data) {
                        const titles = data.titles || [];
                        titles.push(title);
                        chrome.storage.local.set({ "titles": titles }, function () {
                            addTitleToList(title, url, showType);
                        });
                    });
                }
                
            });
        });
    });

    function addTitleToList(title, url, showType) {
        const li = document.createElement("li");

        const titleDiv = document.createElement("div");
        titleDiv.innerHTML = "<b>Title: </b>" + title;

        const urlDiv = document.createElement("div");
        urlDiv.innerHTML = "<b>URL: </b><a href=" + url + ">" + url + "</a>";

        const typeDiv = document.createElement("div");
        typeDiv.innerHTML = "<b>Show Type: </b>" + showType;

        // newDiv.append("Title: " + title);
        // newDiv.append("URL: " + url);
        // newDiv.append("Show Type: " + showType);

        li.appendChild(titleDiv);
        li.appendChild(urlDiv);
        li.appendChild(typeDiv);
        
        titleList.appendChild(li);
    }
});