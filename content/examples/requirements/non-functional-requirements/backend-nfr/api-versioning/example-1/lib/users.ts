export type User = { id: string; givenName: string; familyName: string; email: string };

const users: User[] = [
  { id: "u_1", givenName: "Ada", familyName: "Lovelace", email: "ada@example.com" },
  { id: "u_2", givenName: "Grace", familyName: "Hopper", email: "grace@example.com" }
];

export function listUsers() {
  return users;
}

export function toV1(u: User) {
  return { id: u.id, name: `${u.givenName} ${u.familyName}` };
}

export function toV2(u: User) {
  return { id: u.id, givenName: u.givenName, familyName: u.familyName, email: u.email };
}

