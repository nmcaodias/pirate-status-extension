

document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("saveTitle");
    const titleList = document.getElementById("titleList");

    // Load saved titles
    chrome.storage.local.get("info", function (data) {
        if (data.info) {
            data.info.forEach(info => addInfoToList(info.title, info.url, info.showType));
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
                    const tempInfo = {title: title, url: url, showType: showType};
                    
                    chrome.storage.local.get("info", function (data) {
                        const info = data.info || [];
                        info.push(tempInfo);
                        chrome.storage.local.set({ "info": info }, function () {
                            addInfoToList(title, url, showType);
                        });
                    });
                    /*
                    chrome.storage.local.get("titles", function (data) {
                        const titles = data.titles || [];
                        titles.push(title);
                        chrome.storage.local.set({ "titles": titles }, function () {
                            addInfoToList(title, url, showType);
                        });
                    });
                    */
                }
                
            });
        });
    });

    function addInfoToList(title, url, showType) {
        const li = document.createElement("li");

        const titleDiv = document.createElement("div");
        titleDiv.innerHTML = "<b>Title: </b>" + title;
        li.appendChild(titleDiv);
        
        const urlDiv = document.createElement("div");
        urlDiv.innerHTML = "<b>URL: </b><a href=" + url + ">" + url + "</a>";
        li.appendChild(urlDiv);

        const typeDiv = document.createElement("div");
        typeDiv.innerHTML = "<b>Show Type: </b>" + showType;
        li.appendChild(typeDiv);
        
        titleList.appendChild(li);
    }
});