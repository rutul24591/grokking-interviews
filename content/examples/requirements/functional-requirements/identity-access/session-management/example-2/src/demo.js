function riskBucket(session) {
  if (session.locationChanged && session.deviceChanged) return "high";
  if (session.locationChanged || session.deviceChanged) return "medium";
  return "low";
}

console.log(riskBucket({ locationChanged: false, deviceChanged: false }));
console.log(riskBucket({ locationChanged: true, deviceChanged: true }));
