let activeTab = null;
let startTime = null;
let websiteData = {};
const userId = "user123"; // Replace with dynamic user ID if needed

// ✅ Detect when the user switches tabs
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        if (tab.url) trackTime(tab.url);
    });
});

// ✅ Detect when a tab is updated (e.g., new page loaded)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        trackTime(tab.url);
    }
});

// ✅ Function to track time on a website and send data to backend
function trackTime(url) {
    if (activeTab) {
        let timeSpent = (Date.now() - startTime) / 1000; // Convert to seconds
        if (!websiteData[activeTab]) websiteData[activeTab] = 0;
        websiteData[activeTab] += timeSpent;

        // ✅ Send data to backend
        sendDataToBackend(activeTab, websiteData[activeTab]);
    }
    activeTab = new URL(url).hostname;
    startTime = Date.now();
}

// ✅ Function to send tracked data to backend
function sendDataToBackend(url, timeSpent) {
    fetch("http://localhost:5000/api/data/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: url,
            timeSpent: timeSpent,
            userId: userId
        })
    })
    .then(response => response.json())
    .then(data => console.log("Data saved:", data))
    .catch(error => console.error("Error saving data:", error));
}

// ✅ Listen for popup requests to send data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTimeData") {
        sendResponse(websiteData);
    }
});
