function validateCredentials({ email, password }) {
  return {
    hasEmail: email.includes('@'),
    hasPassword: password.length >= 12,
    valid: email.includes('@') && password.length >= 12,
  };
}

console.log(validateCredentials({ email: 'owner@example.com', password: 'CorrectHorseBatteryStaple' }));
console.log(validateCredentials({ email: 'ownerexample.com', password: 'short' }));
