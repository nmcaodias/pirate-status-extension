chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchPageData") {
        try {
            //const showType = window.location.href.split("/")[3];
            const title = document.getElementsByClassName("text-light")[0].innerText.split(" - ")[0];
            const url = window.location.href;
            const season = document.getElementsByClassName("text-light")[0].innerText.split(" - ")[1].split(" ")[1];
            const numberOfEpisodes = document.getElementById("eps-list").getElementsByTagName('*').length;
            let episode = 1;
            for (let i = 1; i < numberOfEpisodes + 1; i++) {
                let episodeHtml = document.getElementById("ep-" + i);
                if (episodeHtml.disabled) {
                    episode = i;
                    break;
                }
            }

            const infoData = {
                title: title,
                url: url,
                season: season,
                episode: episode
            };

            sendResponse(infoData); // Always send a response
        } catch (error) {
            console.error("Error fetching page data:", error);
            sendResponse({ error: "Failed to fetch page data." }); // Send error response
        }
    }
    return true; // Keep the channel open for async response
});
