function timezoneRisk(entry) {
  const crossTimezone = entry.authorTimezone !== entry.publishTimezone;
  const crossesQuietHours = entry.publishHour < 6 || entry.publishHour > 22;
  return {
    risk: crossTimezone && crossesQuietHours ? "high" : crossTimezone ? "medium" : "low",
    action: crossTimezone ? "show-timezone-confirmation" : "publish-as-scheduled",
    crossesQuietHours
  };
}

console.log(timezoneRisk({ authorTimezone: "Asia/Kolkata", publishTimezone: "America/Los_Angeles", publishHour: 23 }));
