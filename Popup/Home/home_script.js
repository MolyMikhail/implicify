document.onload = chrome.runtime.sendMessage(
    {
        message: "get-playlists",
    },
    (response) => {
        if (response.message === "success") {
            
        }
    }
);
