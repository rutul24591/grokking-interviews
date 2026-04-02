function evaluateFrequencyControls(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    allowImmediateSend: entry.volumeBudgetRemaining > 0 && !entry.quietHoursActive,
    bundleNotifications: entry.volumeBudgetRemaining <= 0 || entry.backlogSize > 5,
    showTimezoneWarning: entry.quietHoursTimezoneMismatch
  }));
}

console.log(JSON.stringify(evaluateFrequencyControls([
  {
    "profileId": "fc-1",
    "volumeBudgetRemaining": 6,
    "quietHoursActive": false,
    "backlogSize": 1,
    "quietHoursTimezoneMismatch": false
  },
  {
    "profileId": "fc-2",
    "volumeBudgetRemaining": 0,
    "quietHoursActive": false,
    "backlogSize": 9,
    "quietHoursTimezoneMismatch": false
  },
  {
    "profileId": "fc-3",
    "volumeBudgetRemaining": 2,
    "quietHoursActive": true,
    "backlogSize": 3,
    "quietHoursTimezoneMismatch": true
  }
]), null, 2));
