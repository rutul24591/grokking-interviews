export type Notification = { id: string; ts: number; text: string };

let version = 0;
let notifications: Notification[] = [];

export function resetNotifications() {
  version = 0;
  notifications = [];
}

export function publishNotification(text: string) {
  version++;
  const n: Notification = { id: `n_${version}`, ts: Date.now(), text };
  notifications = [n, ...notifications].slice(0, 50);
  return { version, notification: n };
}

export function getNotifications() {
  return { version, notifications };
}

