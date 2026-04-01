function shouldRotate({ ipMismatch, userAgentMismatch, tokenAgeMinutes }) {
  return ipMismatch || userAgentMismatch || tokenAgeMinutes > 480;
}

console.log(shouldRotate({ ipMismatch: false, userAgentMismatch: false, tokenAgeMinutes: 60 }));
console.log(shouldRotate({ ipMismatch: true, userAgentMismatch: false, tokenAgeMinutes: 60 }));
