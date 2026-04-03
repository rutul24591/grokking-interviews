function evaluateClientValidation(values) {
  return {
    displayName: values.displayName.trim().length >= 4,
    email: values.email.endsWith("@company.com"),
    password: values.password.length >= 10 && /\d/.test(values.password),
    confirmPassword: values.password === values.confirmPassword,
    region: Boolean(values.region)
  };
}

const scenarios = [
  { displayName: "Rutu", email: "rutu@company.com", password: "securepass9", confirmPassword: "securepass9", region: "us-east" },
  { displayName: "Ru", email: "rutu@gmail.com", password: "short", confirmPassword: "short", region: "" },
  { displayName: "Principal", email: "principal@company.com", password: "securepass9", confirmPassword: "securepass8", region: "eu-west" }
];

console.log(scenarios.map(evaluateClientValidation));
