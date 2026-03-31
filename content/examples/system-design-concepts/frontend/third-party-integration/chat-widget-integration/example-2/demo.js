const sdk = { loaded: false, initialized: false };

function loadScript() {
  sdk.loaded = true;
  console.log("script loaded");
}

function initWidget() {
  if (!sdk.loaded) {
    console.log("init blocked until script is loaded");
    return;
  }
  sdk.initialized = true;
  console.log("widget initialized");
}

initWidget();
loadScript();
initWidget();
