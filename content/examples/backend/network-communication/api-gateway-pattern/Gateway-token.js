export function verifyToken(token) {
  if (!token) return null;
  if (token !== "demo-token") return null;
  return { id: "u123", roles: ["user"] };
}