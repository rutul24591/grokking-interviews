function defaultConsent({ region, doNotTrack }) {
  if (doNotTrack) return { analytics: false, ads: false };
  if (region === "eu") return { analytics: false, ads: false };
  return { analytics: true, ads: false };
}

console.log(defaultConsent({ region: "eu", doNotTrack: false }));
console.log(defaultConsent({ region: "us", doNotTrack: true }));
console.log(defaultConsent({ region: "us", doNotTrack: false }));
