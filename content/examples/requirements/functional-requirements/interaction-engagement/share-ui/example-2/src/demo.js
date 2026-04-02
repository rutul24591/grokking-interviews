function chooseShareRoute(contexts) {
  return contexts.map((context) => ({
    id: context.id,
    route: context.nativeAvailable ? "navigator-share" : context.destinationAvailable ? "deep-link" : "copy-link",
    appendCampaignTags: context.surface === "feed",
    deferUntilAuth: context.requiresAuth && !context.sessionReady
  }));
}

console.log(chooseShareRoute([
  { id: "sh-1", nativeAvailable: false, destinationAvailable: true, surface: "feed", requiresAuth: false, sessionReady: true },
  { id: "sh-2", nativeAvailable: false, destinationAvailable: false, surface: "detail", requiresAuth: true, sessionReady: false }
]));
