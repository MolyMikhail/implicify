ce_get_playlists_button = document.getElementById("get-playlists");

if (ce_get_playlists_button) {
    ce_get_playlists_button.addEventListener("click", () => {
        chrome.runtime.sendMessage(
            {
                message: "get-playlists",
            },
            (response) => {
                if (response.message === "success") {
                    ce_get_playlists_button.innerHTML = `Working!`;
                }
            }
        );
    });
}

document.querySelector("#sign-in").addEventListener("click", () => {
    chrome.runtime.sendMessage(
        {
            message: "login",
        },
        (response) => {
            if (response.message === "success") {
            }
        }
    );
});

document.querySelector("#sign-out").addEventListener("click", () => {
    chrome.runtime.sendMessage(
        {
            message: "logout",
        },
        (response) => {
            if (response.message === "success") {
            }
        }
    );
});

document.querySelector("#get-songs-from-playlist").addEventListener("click", () => {
    chrome.runtime.sendMessage(
        {
            message: "get-songs-from-playlist",
            playlistId: "1lMxticOy8bHDPirdgCM7h"
        },
        (response) => {
            if (response.message === "success") {
            }
        }
    );
});

// if (ce_sign_in_button) {
//     ce_sign_in_button.addEventListener("click", function () {
//         chrome.runtime.sendMessage({ message: "login" }, function (response) {
//             if (response.message === "success") {
//                 ce_sign_in_button.innerHTML = `Working!`;
//                 window.close();
//             }
//         });
//     });
// }
