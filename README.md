# 🎼 Implicify

A Google Chrome extension to convert the songs in any Spotify playlist to a non-explicit version, creating a "filtered' version of the original playlist.

_[Product Demo](https://youtu.be/UXLnbLJ62JY)_

## 📝 Contents

---

- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
- [How it Works](#️-how-it-works)
  - [Google Chrome Extension](#google-chrome-extension)
  - [Spotify API](#spotify-api)
  - [Inspiration](#inspiration)
  - [Challenges We Ran Into](#challenges-we-ran-into)
  - [What We Learned](#what-we-learned)
  - [Running the Program](#running-the-program)
- [Future Features](#️-future-features)
- [Contributors](#️-contributors)

## 🚀 Getting Started

---

These instructions will give you a copy of the project up and running on
your local web browser for development and testing purposes. The product is not currently available yet on the [Google Chrome Web Store](https://chrome.google.com/webstore).

### Prerequisites

- [Google Chrome v88+ w/ Manifest V3 support](https://www.google.com/intl/en_ca/chrome/)
- [Spotify Account](https://www.spotify.com/us/signup/)

### Installing

1. Download the code from the project's GitHub repository as a single folder
2. Navigate to `chrome://extensions` in your Google Chrome's address bar
3. Enable developer mode at the top right

![Google Chrome developer mode toggle](https://i.imgur.com/KIK09HM.png)
4. Click `Load unpacked` at the top left

![Load unpacked button](https://i.imgur.com/WjdrOr5.png)
5. Navigate to the downloaded project folder and select it
6. Toggle the extension on using the switch at the bottom right

![Extension card view with toggle at bottom right](https://i.imgur.com/P7o8SU9.png)

## ⚙️ How it Works

---

### Google Chrome Extension

**Implicify** is developed as a Google Chrome extension, which requires HTML5, CSS3 as the front-end, and JavaScript as the back-end. Each page is made up of a `.html` document, where each are linked to a dedicated `.css` file to add decoration and animation to all the page elements. JavaScript is utilized to add functionality to the elements, as well as connect the front-end design of the program to Spotify's Application Programming Interface (API).

For example, this snippet of code from the `log_in_styles.css` file decorates the `Log In With Spotify` button with rounded attributes and a bright green background, while also giving it animation properties that allows the button to feel more active when it is initially loaded, hovered upon, and clicked.

```css
#log-in-button {
    animation: 4s ease-out 0s 1 slideInFromBottom;

    filter: drop-shadow(0 3px 10px rgba(0, 0, 0, 0.5));

    color: white;
    background-color: transparent;
    border-color: transparent;
    border-radius: 10px;

    background-color: #1db854;

    display: flex;
    flex-direction: row;

    align-items: center;

    transition: 0.5s;

    font-family: "CircularStd-Medium";
}
```

In this JavaScript code snippet, functionality is added to the `Log In With Spotify` button by instructing it to listen for any `click` actions. Google Chrome utilizes its own [JavaScript library module](https://developer.chrome.com/docs/extensions/), which can be used to send 'messages' between `.js` files, passing a main `message` property and returning a `payload` with critical information, allowing interaction between different parts of the program.

```js
document.querySelector("#log-in-button").addEventListener("click", () => {
    console.log("Log in button clicked!");
    chrome.runtime.sendMessage(
        {
            message: "login",
        },
        (response) => {
            if (response.message === "success") {
                window.location.href = "../Home/home.html";
            }
        }
    );
});
```

To update the front-end with the list of the user's playlist and each playlist's containing songs, the data is first fetched from Spotify's API, and stored inside a `payload` as a list of dictionaries. The `payload` is then passed to one of the `script.js` files accordingly, where it is parsed with instructions to add, modify, or remove HTML elements and CSS properties on the fly. Since Spotify hosts all their images through an easily accessible URL, the same URLs can be used in place of any `img` HTML elements.

```js
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
```

### Spotify API

Spotify's API allows the program to communicate with Spotify and its database, being able to fetch songs and playlist information through an API URL endpoint. For example, this function fetches all the songs' name, artists, album info, etc. from a specific playlist, given an authentication token and playlist ID.

```js
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
```

Using this, fetching each song's non-explicit version was easily achievable by comparing the explicit version's album data with coordinating non-explicit versions of the album, which then we could use to extract the non-explicit version of the track, and add it into the new playlist.

### Inspiration
Implicify is built on the concept of aiding regular Spotify users with finding non-explicit versions of songs easily, especially for those who wish to use Spotify as their main music platform for younger audiences (i.e. teachers, camp counsellors, parents, etc.)

With Spotify's main web application, there is not an easy and clear method of finding non-explicit versions of a song. The only clear option is a toggle in the user's settings to completely disable the playing of songs with an `explicit` tag.

To manually retrieve the non-explicit version of a Spotify song, you are required to navigate to the song's original album, scroll down to the `more releases` dropdown, find the correct album release with the censored versions, and add each individual song back into a playlist one by one.

Implicify automates all the manual work for you, as anyone can just tell the program which playlist to filter with in a few button clicks, converting every song inside the playlist, instead of manually taking 5 steps for every song.

### Challenges We Ran Into
- Conflicts with asynchronous API calls and data transmission between different file-types
- Working with Spotify API's single sign-on (SSO) and token authentication

### What We Learned
- Designing and prototyping the program with Figma
- Creating a boilerplate with HTML5
- Decorating the program with CSS3
- Programming functionality and automation with JavaScript with Spotify Web API
- How to manage and handle JavaScript Promise objects
- Organizing JavaScript asychronous API calls to achieve parallelism programming

### Running the Program

This Google Chrome extension can be activated by clicking the `Extensions` icon on the top right of your Google Chrome browser (puzzle piece icon), and clicking on the `Implicify` extension.

![Google Chrome Extension Icon](https://i.imgur.com/bAdqyJB.png)

## ✔️ Future Features

---

🗹 Ability to detect Spotify playlist links from active, opened Chrome tabs

🗹 Nonobstructive pop-up prompting user to use the detected Spotify playlist

🗹 Option to select multiple Spotify playlists to filter and merge into a single, non-explicit playlist

## ✏️ Contributors

---

  - **Moly Mikhail** - [MolyMikhail](https://github.com/MolyMikhail)
    - Completed the front-end development with HTML5 & CSS3, ensuring the best software user experience
  - **Willie Pai** - [PaisWillie](https://github.com/PaisWillie)
    - Developed the back-end using JavaScript and Spotify API, connecting every part of the code together

See also the list of
~~[contributors](https://github.com/MolyMikhail/implicify/contributors)~~
who participated in this project.
