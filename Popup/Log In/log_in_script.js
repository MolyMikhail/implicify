document.querySelector("#log-in-button").addEventListener("click", () => {
    console.log("Log in button clicked!");
    chrome.runtime.sendMessage(
        {
            message: "login",
        },
        (response) => {
            if (response.message === "success") {
                // Change to home page
                window.location.href = "../Home/home.html";
            }
        }
    );
});
