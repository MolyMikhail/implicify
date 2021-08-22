document.querySelector("#back-button").addEventListener("click", () => {
    // TODO: Remove this
    window.location.href = "../Home/home.html";
});

// document.onload = chrome.runtime.sendMessage(
//     {
//         message: "get-songs-from-playlist",

//         playlistId:
//             chrome.storage.local.get("selectedPlaylistId").selectedPlaylistId,
//     },
//     (response) => {
//         if (response.message === "success") {
//             console.log("Displaying response.payload:");
//             console.log(response.payload);
//         }
//     }
// );

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "load-songs-from-playlist-id") {
        chrome.runtime.sendMessage(
            {
                message: "get-songs-from-playlist",
                playlistId: request.playlistId,
            },
            (response) => {
                if (response.message === "success") {
                    console.log(
                        "get-songs-from-playlist message succesful, appending elements to HTML."
                    );
                }

                console.log(response.payload);
            }
        );
    }
});

document.querySelector("#convert").addEventListener("click", () => {
    chrome.runtime.sendMessage(
        {
            message: "create-playlist",
        },
        (response) => {
            if (response.message === "success") {
                // load new playlist with filtered songs OR
                // open up new play list in tab
            }
        }
    );
});

playlist_cover_img = document.querySelector("#playlist-cover");
playlist_name_p = document.querySelector("#playlist-name");
song_list_div = document.querySelector("#song-list");

document.onload = chrome.runtime.sendMessage(
    {
        message: "get-playlist-id",
    },
    (response) => {
        if (response.message === "success") {
            chrome.runtime.sendMessage(
                {
                    message: "get-songs-from-playlist",
                    playlistId: response.payload,
                },
                (data) => {
                    if (data.message === "success") {
                        // load HTML elements
                        console.log(data.payload);

                        playlist_cover_img.src =
                            data.payload["playlistCoverURL"];
                        playlist_name_p.innerHTML =
                            data.payload["playlistName"];

                        for (let i = 0; i < data.payload.songs.length; i++) {
                            let song_div = document.createElement("div");
                            song_div.className = "song";

                            let song_cover_img = document.createElement("img");
                            song_cover_img.className = "song-cover";
                            song_cover_img.src =
                                data.payload.songs[i]["albumCoverURL"];

                            let song_details_div =
                                document.createElement("div");
                            song_details_div.className = "song-details";

                            let song_name_p = document.createElement("p");
                            song_name_p.className = "song-name";

                            let songName = data.payload.songs[i]["songName"];

                            let length = 35;
                            song_name_p.innerHTML =
                                songName.length > length
                                    ? songName.substring(0, length - 3) + "..."
                                    : songName;

                            let song_artist_p = document.createElement("p");
                            song_artist_p.className = "song-artist";

                            let artist =
                                data.payload.songs[i]["songArtists"][0]["name"];

                            if (data.payload.songs[i]["isExplicit"]) {
                                song_artist_p.innerHTML = "🅴 " + artist;
                            } else {
                                song_artist_p.innerHTML = artist;
                            }

                            song_details_div.appendChild(song_name_p);
                            song_details_div.appendChild(song_artist_p);

                            song_div.appendChild(song_cover_img);
                            song_div.appendChild(song_details_div);

                            song_list_div.appendChild(song_div);
                        }

                        // payload template

                        //     payload: {
                        //         songs: [{
                        //             songId,
                        //             songName,
                        //             songArtists,
                        //             isExplicit,
                        //             albumCoverURL,
                        //             albumId,
                        //             albumName,
                        //             albumArtist,
                        //         }],
                        //         playlistName,
                        //         playlistCoverURL,
                        //     }
                        // }
                    }
                }
            );
        }
    }
);
