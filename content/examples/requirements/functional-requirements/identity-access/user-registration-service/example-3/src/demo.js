function requireManualReview({ disposableEmail, highEmployeeCount, sanctionedDomain }) {
  return disposableEmail || highEmployeeCount || sanctionedDomain;
}

console.log(requireManualReview({ disposableEmail: false, highEmployeeCount: false, sanctionedDomain: false }));
console.log(requireManualReview({ disposableEmail: false, highEmployeeCount: true, sanctionedDomain: false }));
