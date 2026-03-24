import { createSender, type Notification } from "./factory";

const batch: Notification[] = [
  { kind: "email", to: "ada@example.com", subject: "Welcome" },
  { kind: "sms", to: "+15550001111", text: "OTP: 123456" },
  { kind: "push", deviceId: "dev-1", title: "You have a new message" }
];

for (const n of batch) {
  const sender = createSender(n);
  process.stdout.write(`${sender.send()}\n`);
}

