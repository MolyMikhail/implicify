require('dotenv').config();

console.log("Running!");

let express = require("express");
let request = require("request");
let querystring = require("querystring");

let app = express();

console.log(process.env.SPOTIFY_CLIENT_ID)

let redirect_uri = process.env.REDIRECT_URI || "http://localhost:8888/callback";

app.get("/login", function (req, res) {
    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            querystring.stringify({
                response_type: "code",
                client_id: process.env.SPOTIFY_CLIENT_ID,
                scope: "user-read-private user-read-email",
                redirect_uri,
            })
    );
});

let port = process.env.PORT || 8888;
console.log(
    `Listening on port ${port}. Go /login to initiate authentication flow.`
);
app.listen(port);
