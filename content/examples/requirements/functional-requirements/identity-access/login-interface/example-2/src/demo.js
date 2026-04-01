function validateForm({ email, password, rememberMe }) {
  const validEmail = email.includes("@") && email.includes(".");
  const validPassword = password.length >= 8;
  return {
    validEmail,
    validPassword,
    rememberMeAllowed: rememberMe ? validPassword : true,
    valid: validEmail && validPassword
  };
}

console.log(validateForm({ email: "owner@example.com", password: "CorrectHorseBatteryStaple", rememberMe: true }));
console.log(validateForm({ email: "ownerexample.com", password: "short", rememberMe: true }));
