document.addEventListener('DOMContentLoaded', () => {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const openWppBtn = document.getElementById('openWppBtn');
    const testBlock = document.getElementById('testBlock');
    const testNumber = document.getElementById('testNumber');
    const sendTestBtn = document.getElementById('sendTestBtn');

    // Verify if a WhatsApp web tab is currently open
    chrome.tabs.query({ url: "https://web.whatsapp.com/*" }, (tabs) => {
        if (tabs.length > 0) {
            statusDot.classList.remove('disconnected');
            statusDot.classList.add('connected');
            statusText.textContent = "WhatsApp Web is Open";
            statusText.style.color = "#10b981"; // Emerald green

            openWppBtn.style.display = 'none';
            testBlock.style.display = 'block';
        } else {
            statusDot.classList.remove('connected');
            statusDot.classList.add('disconnected');
            statusText.textContent = "WhatsApp Web is Closed";
            statusText.style.color = "#ef4444"; // Red

            openWppBtn.style.display = 'block';
            testBlock.style.display = 'none';
        }
    });

    // Extra listener if we want the popup to receive events
    chrome.runtime.onMessage.addListener((message) => {
        // We could add reaction to some event if needed in the future
        console.log("Popup message received: ", message);
    });

    sendTestBtn.addEventListener('click', () => {
        const number = testNumber.value.replace(/\D/g, '');
        if (!number) {
            alert("Please enter a valid number.");
            return;
        }

        sendTestBtn.disabled = true;
        sendTestBtn.textContent = "Sending...";

        const message = "🤖 Hello! This is a test message from Welidz WhatsApp Connect.";

        chrome.runtime.sendMessage({
            type: "SEND_MESSAGE",
            number: number,
            message: message
        }, (response) => {
            sendTestBtn.disabled = false;
            sendTestBtn.textContent = "Send Test Message";

            if (response && response.success) {
                alert("Message queued for sending!");
            } else {
                alert("Error: " + (response?.message || "Check extension logs."));
            }
        });
    });
});
