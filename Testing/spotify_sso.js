console.log("Running!");

app.get("/login", function (req, res) {
    var scopes = "user-read-private user-read-email";
    res.redirect(
        "https://accounts.spotify.com/authorize" +
            "?response_type=code" +
            "&client_id=" +
            my_client_id +
            (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
            "&redirect_uri=" +
            encodeURIComponent(redirect_uri)
    );
});
