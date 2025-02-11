

document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("saveInfo");
    const titleList = document.getElementById("infoList");

    // Load saved titles
    chrome.storage.local.get("info", function (data) {
        if (data.info) {
            data.info.forEach(info => addInfoToList(info.title, info.url, info.season, info.episode, info.rating));
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
                    const rating = 0;
                    
                    const tempInfo = {
                                        title: title, 
                                        url: url,
                                        season: season,
                                        episode: episode,
                                        id: 0,
                                        rating: rating
                                    };
                    
                    chrome.storage.local.get("info", function (data) {
                        const info = data.info || [];
                        //check if show has already been saved
                        const index = info.findIndex(item => item.title === tempInfo.title);
                        if (index !== -1) {
                            info[index].url = tempInfo.url;
                            info[index].season = tempInfo.season;
                            info[index].episode = tempInfo.episode;
                            chrome.storage.local.set({ "info": info }, function () {
                                updateInfoToList(title, url, season, episode, rating);
                            });
                        }
                        else{
                            info.push(tempInfo);
                            chrome.storage.local.set({ "info": info }, function () {
                            addInfoToList(title, url, season, episode, rating);
                        });
                        }
                        getShowRating(title).then(({ showId, voteAverage }) => {
                            const showData = { showId, voteAverage };
                            updateRatingTolist(title, showData.voteAverage); // Rating is updated here
                            const index = info.findIndex(item => item.title === tempInfo.title);
                            if (index !== -1) {
                                info[index].rating = showData.voteAverage;
                                chrome.storage.local.set({ "info": info }, function () {
                                    updateRatingTolist(title, showData.voteAverage); // Rating is updated here
                                });
                            }
                        }).catch(err => {
                            console.error("API call failed:", err);
                        });
                    });
                }
                
            });
        });
    });
    function getShowRating(title){
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNDhjZmVhNjhlYWJkNmZhZTA3NzU2NDkzN2M4NTZhNCIsIm5iZiI6MTczOTI4MzQ3MC42MjIwMDAyLCJzdWIiOiI2N2FiNWMwZTViZDlmZTUwNTdiMDljNTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.igiggg7w0_0vzP27SPBzmqmSEB6XGvHxfL93eOP0NQI'
            }
          };
        console.log("Show deleted from storage:", title);
        return fetch(`https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(title)}&include_adult=false&language=en-US&page=1`, options)
            .then(res => res.json())
            .then(data => {
                console.log(data); // Log the full response for debugging
                const showId = data.results[0].id;
                const voteAverage = data.results[0].vote_average;
                return {showId,voteAverage};
            })
            .catch(err => console.error(err));
        
        
    }
    function updateRatingTolist(title, rating) {
        const infoList = document.getElementById("infoList");

        const existingLi = Array.from(infoList.getElementsByTagName("li")).find(li => {
            return li.querySelector("div").textContent.includes(title);
        });
        if (existingLi) {
            const ratingDiv = existingLi.querySelector("div:nth-child(5)");
            ratingDiv.innerHTML = "<b>Rating: </b>(" + rating + ")/10";
        }
    }
    
    function updateInfoToList(title, url, season, episode, rating) {
        const infoList = document.getElementById("infoList");

        const existingLi = Array.from(infoList.getElementsByTagName("li")).find(li => {
            return li.querySelector("div").textContent.includes(title);
        });

        const titleDiv = existingLi.querySelector("div:nth-child(1)");
        const urlDiv = existingLi.querySelector("div:nth-child(2)");
        const seasonDiv = existingLi.querySelector("div:nth-child(3)");
        const episodeDiv = existingLi.querySelector("div:nth-child(4)");
        const ratingDiv = existingLi.querySelector("div:nth-child(5)");

        titleDiv.innerHTML = `<b>Title: </b>${title}`;
        urlDiv.innerHTML = `<b>URL: </b><a href="${url}">${url}</a>`;
        seasonDiv.innerHTML = `<b>Season: </b>${season}`;
        episodeDiv.innerHTML = `<b>Episode: </b>${episode}`;
        ratingDiv.innerHTML = "<b>Rating: </b>(" + rating + ")/10";

    }
    function removeInfoFromStorage(title) {
        chrome.storage.local.get("info", function (data) {
            const info = data.info || [];

            const index = info.findIndex(item => item.title === title);
        
            if (index !== -1) {
                info.splice(index, 1);
                chrome.storage.local.set({ "info": info }, function () {
                    console.log("Show deleted from storage:", tempInfo.title);
                });
            } else {
                console.log("Show not found in storage:", tempInfo.title);
            }
        });
    }


    function addInfoToList(title, url, season, episode, rating) {
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

        const ratingDiv = document.createElement("div");
        ratingDiv.innerHTML = "<b>Rating: </b>(" + rating + ")/10"; // Format: (rating)/10
        li.appendChild(ratingDiv);

        // Add a button to the <li>
        const button = document.createElement("button");
        button.textContent = "Delete";
        button.style.marginTop = "5px";
        button.style.width = "100%";
        button.addEventListener("click", function () {
            // Remove the <li> when the button is clicked
            infoList.removeChild(li);
            // Optional: Remove the item from chrome.storage.local
            removeInfoFromStorage(title);
         });
        li.appendChild(button);
        
        infoList.appendChild(li);
    }
});