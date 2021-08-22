const CLIENT_ID = encodeURIComponent("39d98902d36a47ed9bd7a6c50e571a20");

// TODO: Censor this
const CLIENT_SECRET = encodeURIComponent("d4347ad265fb47c9b6acb80ca1ab7a3f");

const RESPONSE_TYPE = encodeURIComponent("token");
const REDIRECT_URI = encodeURIComponent(
    "https://enomnapglgekdkdjjalhhbmbnjmlfoba.chromiumapp.org/"
);
const SCOPE = encodeURIComponent("user-read-email");
const SHOW_DIALOG = encodeURIComponent("true");

let state = "";
let accessToken = "";
let playlistID = "";

let userSignedIn = false;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Checks if page loading is complete and URL starts with http
    if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
        playlistID = tab.url.split("/playlist/")[1].split("?")[0];
        console.log(
            "Found Spotify playlist in active tab with the ID: " + playlistID
        );
    }
});

function create_spotify_endpoint() {
    console.log("Creating Spotify endpoint.");
    state = encodeURIComponent(
        "meet" + Math.random().toString(36).substring(2, 15)
    );

    let oauth2_url = `https://accounts.spotify.com/authorize
?client_id=${CLIENT_ID}
&response_type=${RESPONSE_TYPE}
&redirect_uri=${REDIRECT_URI}
&state=${state}
&scope=${SCOPE}
&show_dialog=${SHOW_DIALOG}
`;

    console.log(oauth2_url);

    return oauth2_url;
}

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

const fetchSongsFromPlaylist = async (token, playlistId) => {
    console.log("Getting songs from playlist with ID: " + playlistId);

    const result = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        {
            method: "GET",
            headers: { Authorization: "Bearer " + token },
        }
    );

    const data = await result.json();
    return data;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "login") {
        console.log("'login' request called.");
        console.log("user_sign_in: " + userSignedIn);
        if (userSignedIn) {
            console.log("User is already signed in.");
        } else {
            chrome.identity.launchWebAuthFlow(
                {
                    url: create_spotify_endpoint(),
                    interactive: true,
                },
                function (redirect_url) {
                    if (chrome.runtime.lastError) {
                        console.log(chrome.runtime.lastError);
                        sendResponse({ message: "fail" });
                        console.log("Failed to launch WebAuthFlow");
                    } else {
                        if (
                            redirect_url.includes(
                                "callback?error=access_denied"
                            )
                        ) {
                            sendResponse({ message: "fail" });
                        } else {
                            accessToken = redirect_url.substring(
                                redirect_url.indexOf("access_token=") + 13
                            );
                            accessToken = accessToken.substring(
                                0,
                                accessToken.indexOf("&")
                            );

                            let state = redirect_url.substring(
                                redirect_url.indexOf("state=") + 6
                            );

                            if (state === state) {
                                console.log("SUCCESS");
                                userSignedIn = true;

                                setTimeout(() => {
                                    accessToken = "";
                                    userSignedIn = false;
                                }, 3600000);

                                chrome.action.setPopup(
                                    { popup: "./popup-signed-in.html" },
                                    () => {
                                        sendResponse({ message: "success" });
                                    }
                                );
                            } else {
                                sendResponse({ message: "fail" });
                            }
                        }
                    }
                }
            );
        }
        return true;
    } else if (request.message === "logout") {
        console.log("Logging user out.");
        userSignedIn = false;
        chrome.action.setPopup({ popup: "./popup.html" }, () => {
            sendResponse({ message: "success" });
        });

        return true;
    } else if (request.message === "get-playlists") {
        let playlists = [];

        fetchPlaylists(accessToken).then((result) => {
            for (let i = 0; i < result.items.length; i++)
                playlists.push(
                    // result.items[i]
                    {
                        playlistId: result.items[i]["id"],
                        playlistName: result.items[i]["name"],
                        playlistCoverURL: result.items[i]["images"][0]["url"],
                    }
                );
        });

        console.log(playlists);

        sendResponse({
            message: "success",
            payload: playlists,
        });

        return true;
    } else if (request.message === "get-songs-from-playlist") {
        let playlist = {
            songs: [],
        };

        fetchSongsFromPlaylist(accessToken, request.playlistId).then(
            (result) => {
                console.log(result);

                playlist["playlistName"] = result["name"];
                playlist["playlistCoverURL"] = result["images"][0]["url"];

                for (let i = 0; i < result.tracks.items.length; i++)
                    playlist["songs"].push({
                        songId: result.tracks.items[i]["track"]["id"],
                        songName: result.tracks.items[i]["track"]["name"],
                        songArtist: result.tracks.items[i]["track"]["artists"],
                        isExplicit: result.tracks.items[i]["track"]["explicit"],
                        albumCoverURL:
                            result.tracks.items[i]["track"]["album"][
                                "images"
                            ][0]["url"],
                        albumId: result.tracks.items[i]["track"]["album"]["id"],
                        albumName:
                            result.tracks.items[i]["track"]["album"]["name"],
                        albumArtist:
                            result.tracks.items[i]["track"]["album"]["artists"],
                    });
            }
        );

        console.log(playlist);

        sendResponse({
            message: "success",
            payload: playlist,
        });
    }
    return true;
});
