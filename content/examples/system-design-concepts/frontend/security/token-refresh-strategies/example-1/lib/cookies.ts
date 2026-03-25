export function refreshCookieName() {
  return "__Host-refresh";
}

export function setRefreshCookie(value: string) {
  const secure = process.env.NODE_ENV === "production";
  return [
    `${refreshCookieName()}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
    "Max-Age=604800" // 7 days
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearRefreshCookie() {
  const secure = process.env.NODE_ENV === "production";
  return [
    `${refreshCookieName()}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
    "Max-Age=0"
  ]
    .filter(Boolean)
    .join("; ");
}

