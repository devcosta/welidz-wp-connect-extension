document.addEventListener('DOMContentLoaded', () => {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    // Verify if a WhatsApp web tab is currently open
    chrome.tabs.query({ url: "https://web.whatsapp.com/*" }, (tabs) => {
        if (tabs.length > 0) {
            statusDot.classList.remove('disconnected');
            statusDot.classList.add('connected');
            statusText.textContent = "WhatsApp Web is Open";
            statusText.style.color = "#10b981"; // Emerald green
        } else {
            statusDot.classList.remove('connected');
            statusDot.classList.add('disconnected');
            statusText.textContent = "WhatsApp Web is Closed";
            statusText.style.color = "#ef4444"; // Red
        }
    });

    // Extra listener if we want the popup to receive events
    chrome.runtime.onMessage.addListener((message) => {
        // We could add reaction to some event if needed in the future
        console.log("Popup message received: ", message);
    });
});
