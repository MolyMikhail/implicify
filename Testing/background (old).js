// Runs on initial startup
// chrome.runtime.onInstalled.addListener(() => {
//     chrome.storage.local.set({
//         name: "Willie",
//     });
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     // Checks if page loading is complete and URL starts with http
//     if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
//         chrome.scripting
//             .insertCSS({
//                 target: { tabId: tabId },
//                 files: ["./Foreground/foreground_styles.css"],
//             })
//             .then(() => {
//                 console.log("Injected foreground styles.");

//                 chrome.scripting
//                     .executeScript({
//                         target: { tabId: tabId },
//                         files: ["./Foreground/foreground.js"],
//                     })

//                     .then(() => {
//                         console.log("Injected the foreground script.");
//                     });
//             })
//             .catch((err) => console.log(err));
//     }
// });

// var CONFIG = require('./config.json');

// TODO: Censor variables
const CLIENT_ID = encodeURIComponent("39d98902d36a47ed9bd7a6c50e571a20");
const CLIENT_SECRET = encodeURIComponent("d4347ad265fb47c9b6acb80ca1ab7a3f");
const REDIRECT_URI = encodeURIComponent("http://localhost:8888/callback");
const STATE = encodeURIComponent(
    "meet" + Math.random().toString(36).substring(2, 15)
);
const SCOPE = encodeURIComponent("user-read-email");
const SHOW_DIALOG = encodeURIComponent("true");

const getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
        },
        body: "grant_type=client_credentials",
    });

    const data = await result.json();
    return data.access_token;
};

const fetchPlaylists = async (token) => {
    const result = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
    });

    const data = await result.json();
    return data;
};

let user_signed_in = false;

function create_spotify_endpoint() {
    let oauth2_url = `https://accounts.spotify.com/authorize
    ?client_id=${CLIENT_ID}
    &response_types=${REPONSE_TYPE}
    &redirect_uri=${REDIRECT_URI}
    &state=${state}
    &scope=${SCOPES}
    &show_dialog=${SHOW_DIALOG}
    `;

    console.log(oauth2_url);

    return oauth2_url;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "login") {
        if (userSignedIn) {
            console.log("User is already signed in.");

            return true;
        } else {
            chrome.identity.launchWebAuthFlow(
                {
                    url: create_spotify_endpoint(),
                    interactive: true,
                },
                function (redirect_url) {
                    if (chrome.runtime.lastError) {
                        sendResponse({
                            message: "failed",
                        });
                    } else {
                        if (
                            redirect_url.includes(
                                "callback?error=access_denied"
                            )
                        ) {
                            sendResponse({
                                message: "failed",
                            });
                        } else {
                            console.log(redirect_url);
                        }
                    }
                }
            );
        }

        return true;

    } else if (request.message === "logout") {
        userSignedIn = false;
        
        return true;

    } else if (request.message === "fetch_playlists") {
        console.log(fetchPlaylists(getToken()));
        sendResponse({
            message: "success",
        });

        return true;
    }

    return true;
});
