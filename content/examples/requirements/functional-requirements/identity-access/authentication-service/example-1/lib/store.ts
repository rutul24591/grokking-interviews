export const auth = {
  user: null as null | { email: string; role: string },
  lastMessage: "No login attempt yet.",
};

export function login(email: string, password: string) {
  if (email === "owner@example.com" && password === "CorrectHorseBatteryStaple") {
    auth.user = { email, role: "admin" };
    auth.lastMessage = "Authentication succeeded and a session was established.";
  } else {
    auth.user = null;
    auth.lastMessage = "Authentication failed. Credentials did not match.";
  }
  return auth;
}
