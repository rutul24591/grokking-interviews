function anomaly(newSessionsInHour, trustedRatio) {
  return {
    suspicious: newSessionsInHour >= 5 || trustedRatio < 0.5,
    newSessionsInHour,
    trustedRatio,
  };
}

console.log(anomaly(6, 0.4));
