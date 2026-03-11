import { WPP_Bridge_Utils } from '../../core/utils'
import injectedStoreUrl from '../injected/index.ts?script';

function isWhatsAppLoaded() {
  const chatList = document.querySelector('[id="pane-side"]');
  const headerElement = document.querySelector("header");
  return !!chatList || !!headerElement;
}

function injectScriptUrl(url: string) {
  try {
    const script = document.createElement("script");
    script.type = "module";
    script.src = chrome.runtime.getURL(url);
    script.onload = function () {
      console.log(`✅ file ${url} injected successfully!`);
      script.remove();
    };
    document.head.appendChild(script);
  } catch (e) {
    console.error(`❌ Error injecting file ${url}:`, e);
  }
}

const checkInterval = setInterval(() => {
  if (isWhatsAppLoaded()) {
    console.log("✅ WhatsApp Web loaded and ready!");
    injectScriptUrl(injectedStoreUrl);
    clearInterval(checkInterval);
  } else {
    console.log("⏳ Waiting for WhatsApp Web to load...");
  }
}, 2000);

chrome.runtime.onMessage.addListener((payload: ExtensionMessage, _sender, sendResponse) => {
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
    const { number, message, media, uuid: incomingUuid } = payload;
    const uuid = incomingUuid || WPP_Bridge_Utils.generateUniqueId();

    console.log(`📤 Sending to ${number}: ${message} ${media ? `(Media present)` : ''}`);

    const handleResponse = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.uuid === uuid) {
        console.log("📥 Received response for uuid:", uuid, customEvent.detail);
        document.removeEventListener("WhatsappjsResponse", handleResponse);
        clearTimeout(timeoutId);
        sendResponse(customEvent.detail);
      }
    };

    const timeoutId = setTimeout(() => {
      console.warn("⏳ Timeout waiting for WhatsappjsResponse for uuid:", uuid);
      document.removeEventListener("WhatsappjsResponse", handleResponse);
      sendResponse({ success: false, message: "Timeout waiting for WhatsApp response." });
    }, 5000);

    document.addEventListener("WhatsappjsResponse", handleResponse);

    document.dispatchEvent(
      new CustomEvent("whatsappContentToWhatsappJs", {
        detail: { number, message, media, uuid }
      })
    );

    return true; // Keep the messaging channel open
  }
});
