playlist_list_div = document.querySelector("#playlist-list");

document.onload = chrome.runtime.sendMessage(
    {
        message: "get-playlists",
    },
    (response) => {
        console.log("sent get-playlists message");

        if (response.message === "success") {
            console.log(
                "get-playlists message succesful, appending elements to HTML."
            );
            // Add playlists html elements to #playlist-list

            let row_div;

            console.log("response:");
            console.log(response);

            console.log("response.payload:");
            console.log(response.payload);

            for (let i = 0; i < response.payload.length; i++) {
                if (i % 2 === 0) {
                    row_div = document.createElement("div");
                    row_div.className = "row";
                }

                let album_button = document.createElement("button");
                album_button.className = "album";
                album_button.value = response.payload[i]["playlistId"];

                let album_cover_img = document.createElement("img");
                album_cover_img.className = "album-cover";
                album_cover_img.src = response.payload[i]["playlistCoverURL"];

                let album_name_p = document.createElement("p");
                album_name_p.className = "album-name";

                let playlistName = response.payload[i]["playlistName"];

                let length = 14;
                album_name_p.innerHTML =
                    playlistName.length > length
                        ? playlistName.substring(0, length - 3) + "..."
                        : playlistName;

                album_button.appendChild(album_cover_img);
                album_button.appendChild(album_name_p);
                album_button.addEventListener("click", () => {
                    // set local variable
                    // chrome.storage.local.set({
                    //     selectedPlaylistId: response.payload[i]["playlistId"],
                    // });

                    // call chrome sendMessage

                    // chrome.runtime.sendMessage({
                    //     message: "load-songs-from-playlist-id",
                    //     playlistId: response.payload[i]["playlistId"],
                    // });

                    // change windows

                    // console.log(album_button.value);

                    chrome.runtime.sendMessage(
                        {
                            message: "set-playlist-id",
                            playlistId: response.payload[i]["playlistId"],
                        },
                        (response) => {
                            if (response.message === "success") {
                                window.location.href =
                                    "../Playlist/playlist.html";
                            }
                        }
                    );
                });

                row_div.appendChild(album_button);

                if (i % 2 === 1) {
                    playlist_list_div.appendChild(row_div);
                }

                // playlistId:
                // playlistName:
                // playlistCoverURL
            }
        }
    }
);
