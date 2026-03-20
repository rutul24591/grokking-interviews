import { delayMs } from "./retry";

for (let attempt = 1; attempt <= 5; attempt++) {
  console.log({ attempt, delay: delayMs(50, attempt, 800, 0.2) });
}

