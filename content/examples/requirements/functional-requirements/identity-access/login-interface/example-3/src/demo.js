function resolveReturnTo({ path, userRole }) {
  const safe = path.startsWith("/") && !path.startsWith("//");
  const destination = safe ? path : userRole === "admin" ? "/admin" : "/home";
  return { safe, destination };
}

console.log(resolveReturnTo({ path: "/billing", userRole: "editor" }));
console.log(resolveReturnTo({ path: "https://malicious.example", userRole: "admin" }));
