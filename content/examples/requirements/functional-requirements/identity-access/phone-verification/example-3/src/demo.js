function resendPolicy({ verified, cooldownSeconds, nowSeconds }) {
  if (verified) return { allowed: false, reason: "already-verified" };
  if (nowSeconds < cooldownSeconds) return { allowed: false, reason: "cooldown-active" };
  return { allowed: true, reason: "send-new-code" };
}

console.log(resendPolicy({ verified: false, cooldownSeconds: 30, nowSeconds: 10 }));
console.log(resendPolicy({ verified: true, cooldownSeconds: 0, nowSeconds: 99 }));
