export type Capabilities = {
  serviceWorker: boolean;
  webShare: boolean;
  clipboard: boolean;
  fileSystemAccess: boolean;
};

export function detectCaps(): Capabilities {
  if (typeof window === "undefined") {
    return { serviceWorker: false, webShare: false, clipboard: false, fileSystemAccess: false };
  }
  return {
    serviceWorker: "serviceWorker" in navigator,
    webShare: "share" in navigator,
    clipboard: !!navigator.clipboard,
    fileSystemAccess: "showOpenFilePicker" in window,
  };
}
