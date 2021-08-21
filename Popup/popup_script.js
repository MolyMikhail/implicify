ce_button = document.getElementById("get-playlists");

if (ce_button) {
    ce_button.addEventListener("click", () => {
        chrome.runtime.sendMessage(
            {
                message: "fetch_playlists",
                payload: null,
            },
            (response) => {
                if (response.message === "success") {
                    ce_button.innerHTML = `Working!`;
                }
            }
        );
    });
}
