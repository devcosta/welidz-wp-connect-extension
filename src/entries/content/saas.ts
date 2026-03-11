window.addEventListener("wpp-b2b-connection", () => {
  chrome.runtime.sendMessage({ type: "HELLO_WORLD" }, (response) => {
    window.dispatchEvent(
      new CustomEvent("wpp-b2b-connection-response", { detail: response })
    );
  });
});

window.addEventListener("send-to-whatsapp", (e: Event) => {
  const customEvent = e as CustomEvent;
  const { number, message, mediaUrl } = customEvent.detail;
  console.log("🚀 [SaaS] send-to-whatsapp event received", { number, message, mediaUrl });

  chrome.runtime.sendMessage(
    {
      type: "SEND_MESSAGE",
      ...customEvent.detail,
    } as ExtensionMessage,
    (response) => {
      window.dispatchEvent(
        new CustomEvent("send-to-whatsapp-response", { detail: response })
      );
    }
  );
});
