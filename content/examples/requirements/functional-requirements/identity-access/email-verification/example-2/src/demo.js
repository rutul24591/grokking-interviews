function resendAllowed({ sentCount, cooldownSeconds, secondsSinceLastSend }) {
  return {
    allowed: secondsSinceLastSend >= cooldownSeconds,
    sentCount,
  };
}

console.log(resendAllowed({ sentCount: 1, cooldownSeconds: 30, secondsSinceLastSend: 45 }));
console.log(resendAllowed({ sentCount: 2, cooldownSeconds: 30, secondsSinceLastSend: 5 }));
