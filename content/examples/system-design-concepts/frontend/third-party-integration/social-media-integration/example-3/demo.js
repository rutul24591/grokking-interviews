const attempts = [
  { popupOpened: true, clipboardAvailable: true },
  { popupOpened: false, clipboardAvailable: true },
  { popupOpened: false, clipboardAvailable: false }
];

for (const attempt of attempts) {
  const fallback = attempt.popupOpened ? "none" : attempt.clipboardAvailable ? "copy share link to clipboard" : "show manual share URL";
  console.log(`${attempt.popupOpened ? "popup success" : "popup blocked"} -> ${fallback}`);
}
