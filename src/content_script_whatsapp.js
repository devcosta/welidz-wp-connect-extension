chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => {
  console.log("📨 WhatsApp received message:", payload);

  if (payload.type === "HELLO_WORLD_FROM_SAAS") {
    console.log("👋 Received a Hello World from SaaS!");
    sendResponse({
      success: true,
      message: "WhatsApp Web successfully received Hello World!"
    });
    return true;
  }

  if (payload.type === "SEND_MESSAGE") {
    const { number, message, media } = payload;

    const uuid = WPP_Bridge_Utils.generateUniqueId();

    console.log(`📤 Sending to ${number}: ${message} ${media ? `(Media present)` : ''}`);

    document.dispatchEvent(
      new CustomEvent("whatsappContentToWhatsappJs", {
        detail: { number, message, media, uuid }
      })
    );

    sendResponse({ success: true, message: "Message sent successfully." });

    return true;
  }
});
