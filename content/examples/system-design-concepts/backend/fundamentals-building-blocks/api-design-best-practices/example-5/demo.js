// Versioned route demo.

function handle(path) {
  if (path.startsWith("/v1")) return { data: { name: "Ada" } };
  if (path.startsWith("/v2")) return { data: { fullName: "Ada Lovelace" } };
  return { error: "not-found" };
}

console.log(handle("/v1/users/1"));
console.log(handle("/v2/users/1"));
