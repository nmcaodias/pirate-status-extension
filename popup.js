

document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("saveInfo");
    const titleList = document.getElementById("infoList");

    // Load saved titles
    chrome.storage.local.get("info", function (data) {
        if (data.info) {
            data.info.forEach(info => addInfoToList(info.title, info.url, info.season, info.episode));
        }
    });

    // Save title on button click
    saveButton.addEventListener("click", function () {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

            chrome.runtime.sendMessage({ action: "fetchPageData" }, (response) => {

                if (response) {
                    console.log("Title:", response.title);
                    console.log("URL:", response.url);
                    console.log("Season:", response.season);
                    console.log("Episode:", response.episode);

                    const title = response.title;
                    const url = response.url;
                    const season = response.season;
                    const episode = response.episode;
                    const tempInfo = {
                                        title: title, 
                                        url: url,
                                        season: season,
                                        episode: episode
                                    };
                    
                    chrome.storage.local.get("info", function (data) {
                        const info = data.info || [];
                        info.push(tempInfo);
                        chrome.storage.local.set({ "info": info }, function () {
                            addInfoToList(title, url, season, episode);
                        });
                    });
                }
                
            });
        });
    });

    function addInfoToList(title, url, season, episode) {
        const li = document.createElement("li");

        const titleDiv = document.createElement("div");
        titleDiv.innerHTML = "<b>Title: </b>" + title;
        li.appendChild(titleDiv);
        
        const urlDiv = document.createElement("div");
        urlDiv.innerHTML = "<b>URL: </b> <a href=" + url + ">" + url + "</a>";
        li.appendChild(urlDiv);

        const seasonDiv = document.createElement("div");
        seasonDiv.innerHTML = "<b>Season: </b>" + season;
        li.appendChild(seasonDiv);

        const episodeDiv = document.createElement("div");
        episodeDiv.innerHTML = "<b>Episode: </b>" + episode;
        li.appendChild(episodeDiv);
        
        infoList.appendChild(li);
    }
});