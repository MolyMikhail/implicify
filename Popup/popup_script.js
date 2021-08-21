ce_get_playlists_button = document.getElementById("get-playlists");
ce_sign_in_button = document.getElementById("sign-in");

if (ce_get_playlists_button) {
    ce_get_playlists_button.addEventListener("click", () => {
        chrome.runtime.sendMessage(
            {
                message: "fetch_playlists",
                payload: null,
            },
            (response) => {
                if (response.message === "success") {
                    ce_get_playlists_button.innerHTML = `Working!`;
                }
            }
        );
    });
}

if (ce_sign_in_button) {
    ce_sign_in_button.addEventListener("click", () => {
        chrome.runtime.sendMessage(
            {
                message: "login",
                payload: null,
            },
            (response) => {
                if (response.message === "success") {
                    ce_sign_in_button.innerHTML = `Working!`;
                }
            }
        );
    });
}
