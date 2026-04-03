function evaluateViewportPolicy(config) {
  return {
    id: config.id,
    allowZoomLock: !(config.formHeavy || config.denseContent),
    safeAreaRequired: config.notchedDevice,
    keyboardStrategy: config.fixedHeader ? "visual-viewport-aware" : "flow-layout"
  };
}

const configs = [
  { id: "form-page", formHeavy: true, denseContent: true, notchedDevice: true, fixedHeader: true },
  { id: "media-page", formHeavy: false, denseContent: false, notchedDevice: true, fixedHeader: true },
  { id: "simple-page", formHeavy: false, denseContent: false, notchedDevice: false, fixedHeader: false }
];

console.log(configs.map(evaluateViewportPolicy));
