function chooseSubscriptionWrite(targets) {
  return targets.map((target) => ({
    id: target.id,
    path: target.requiresDoubleOptIn ? "pending-confirmation" : "direct-follow",
    notifyFeedService: target.type === "author",
    createDigestPreference: target.type === "newsletter" || target.highVolume
  }));
}

console.log(chooseSubscriptionWrite([
  { id: "fs-1", requiresDoubleOptIn: true, type: "newsletter", highVolume: true },
  { id: "fs-2", requiresDoubleOptIn: false, type: "author", highVolume: false }
]));
