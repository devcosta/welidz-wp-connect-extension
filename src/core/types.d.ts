export {};

declare global {
  interface Window {
    Store: any;
    WWebJS: any;
    WPP_Bridge_Utils: {
      generateUniqueId: () => string;
    };
  }

  interface MediaData {
    data: string;
    mimetype: string;
    filename: string;
  }

  interface ExtensionMessage {
    type: string;
    number?: string;
    message?: string;
    media?: MediaData;
    mediaUrl?: string;
    uuid?: string;
  }
}
