function canSubmit({ emailValid, passwordStrong, termsAccepted }) {
  return emailValid && passwordStrong && termsAccepted;
}

console.log(canSubmit({ emailValid: true, passwordStrong: true, termsAccepted: true }));
console.log(canSubmit({ emailValid: true, passwordStrong: false, termsAccepted: true }));
