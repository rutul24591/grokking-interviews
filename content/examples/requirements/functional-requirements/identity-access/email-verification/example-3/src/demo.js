function verificationScreen({ verified, tokenFormatValid }) {
  if (verified) return { screen: 'already-verified', nextAction: 'continue' };
  if (!tokenFormatValid) return { screen: 'invalid-token', nextAction: 'request-new-email' };
  return { screen: 'pending-confirmation', nextAction: 'submit-token' };
}

console.log(verificationScreen({ verified: true, tokenFormatValid: true }));
console.log(verificationScreen({ verified: false, tokenFormatValid: false }));
