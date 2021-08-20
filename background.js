chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        name: "Willie",
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Checks if page loading is complete and URL starts with http
    if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
        chrome.scripting
            .insertCSS({
                target: { tabId: tabId },
                files: ["./Foreground/foreground_styles.css"],
            })
            .then(() => {
                console.log("Injected foreground styles.");

                chrome.scripting
                    .executeScript({
                        target: { tabId: tabId },
                        files: ["./Foreground/foreground.js"],
                    })

                    .then(() => {
                        console.log("Injected the foreground script.");
                    });
            })
            .catch((err) => console.log(err));
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "get_name") {
        chrome.storage.local.get("name", (data) => {
            if (chrome.runtime.lastError) {
                sendResponse({
                    message: "failed",
                });
                return;
            }

            sendResponse({
                message: "success",
                payload: data.name,
            });
        });

        return true;
    } else if (request.message === "change_name") {
        chrome.storage.local.set(
            {
                name: request.payload,
            },
            () => {
                if (chrome.runtime.lastError) {
                    sendResponse({
                        message: "fail",
                    });
                }

                sendResponse({
                    message: "success",
                });
            }
        );

        return true;
    }
});
