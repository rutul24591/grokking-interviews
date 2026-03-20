import { nextDelayMs, withJitter, type PollState } from "./poll";

const states: PollState[] = [
  { visible: true, online: true },
  { visible: false, online: true },
  { visible: true, online: false },
];

for (const s of states) {
  const base = nextDelayMs(s);
  console.log({ state: s, base, jittered: withJitter(base) });
}

