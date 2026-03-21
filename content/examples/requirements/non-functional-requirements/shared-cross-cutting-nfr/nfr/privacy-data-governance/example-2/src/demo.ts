type Profile = { userId: string; email: string; phone: string };

function redact(p: Profile) {
  return { userId: p.userId, email: p.email.replace(/(.).+(@.+)/, "$1***$2"), phone: p.phone.replace(/\d(?=\d{2})/g, "*") };
}

console.log(redact({ userId: "u1", email: "ada@example.com", phone: "5550101" }));

