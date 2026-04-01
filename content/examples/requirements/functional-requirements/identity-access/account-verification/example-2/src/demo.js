function resendWindow(now, availableAt) {
  return {
    allowed: now >= availableAt,
    secondsRemaining: Math.max(0, Math.ceil((availableAt - now) / 1000)),
  };
}

console.log(resendWindow(100000, 90000));
console.log(resendWindow(100000, 130000));
