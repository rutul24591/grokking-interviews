export type Notification =
  | { kind: "email"; to: string; subject: string }
  | { kind: "sms"; to: string; text: string }
  | { kind: "push"; deviceId: string; title: string };

type Sender = { send: () => string };

function assertNever(x: never): never {
  throw new Error(`Unhandled notification kind: ${JSON.stringify(x)}`);
}

export function createSender(n: Notification): Sender {
  switch (n.kind) {
    case "email":
      return { send: () => `EMAIL -> ${n.to} subject=${n.subject}` };
    case "sms":
      return { send: () => `SMS -> ${n.to} text=${n.text}` };
    case "push":
      return { send: () => `PUSH -> ${n.deviceId} title=${n.title}` };
    default:
      return assertNever(n);
  }
}

