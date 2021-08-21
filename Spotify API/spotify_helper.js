console.log("Running!")

const getGenres = async (token) => {
    const result = await fetch(
        `https://api.spotify.com/v1/browse/categories?locale=sv_US`,
        {
            method: "GET",
            headers: { Authorization: "Bearer " + token },
        }
    );

    const data = await result.json();
    return data.categories.items;
};

console.log(
    getGenres(
        (token =
            "BQA2q_60aRrgienHm9ZXvANWMgz0lKdCk7bUjf_bf2HOGnRARh9uXxFqg1Wd2WnK95mYha_easFu7OWKx0FKcnOQL0Rp0-x9sPiXnkUBuwn1JCbUCz663_fmJDV1LEDb0Y7fl16WlDAjnsC0BomEFepJAsfsg_UT6Q")
    )
);
