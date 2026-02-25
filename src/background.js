// Função auxiliar para converter blob em Base64
const getBase64FromUrl = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve({
        data: base64data.split(',')[1],
        mimetype: blob.type,
        filename: url.split('/').pop() || 'media'
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "HELLO_WORLD") {
    console.log("🌍 Hello World received! Forwarding to WhatsApp Web...");

    chrome.tabs.query({ url: "https://web.whatsapp.com/*" }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "HELLO_WORLD_FROM_SAAS" },
          (response) => {
            sendResponse(
              response || {
                success: true,
                message: "Hello World forwarded to WhatsApp!",
              }
            );
          }
        );
      } else {
        sendResponse({
          success: false,
          message: "WhatsApp Web is not open",
        });
      }
    });

    return true;
  }

  if (message.type === "SEND_MESSAGE") {
    // Wrapper async para aceitar await
    (async () => {
      try {
        let media = message.media;

        // Se vier mediaUrl mas não media (novo fluxo), converte agora no background
        if (message.mediaUrl && !media) {
          console.log("🔄 [Background] Converting mediaUrl:", message.mediaUrl);
          media = await getBase64FromUrl(message.mediaUrl);
          console.log("✅ [Background] Conversion completed.");
        }

        chrome.tabs.query({ url: "https://web.whatsapp.com/*" }, (tabs) => {
          if (tabs.length > 0) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              {
                type: "SEND_MESSAGE",
                number: message.number,
                message: message.message,
                media: media // Envia o objeto de media já convertido
              },
              (response) => {
                sendResponse(response || { success: false, message: "No response" });
              }
            );
          } else {
            sendResponse({
              success: false,
              message: "WhatsApp Web is not open",
            });
          }
        });
      } catch (error) {
        console.error("❌ [Background] Processing error:", error);
        sendResponse({ success: false, message: "Internal background error: " + error.message });
      }
    })();

    return true; // Indica que a resposta será enviada de forma assíncrona
  }
});
