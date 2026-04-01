function duplicateSignup(existingEmail, normalizedEmail) {
  return existingEmail.toLowerCase() === normalizedEmail.toLowerCase();
}

console.log(duplicateSignup("candidate@example.com", "Candidate@example.com"));
console.log(duplicateSignup("candidate@example.com", "other@example.com"));
