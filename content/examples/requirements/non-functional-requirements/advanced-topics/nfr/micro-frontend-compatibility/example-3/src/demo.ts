import { compatibility } from "./matrix";

for (const host of [1, 2]) {
  for (const remote of [1, 2]) {
    console.log({ host, remote, compat: compatibility({ host, remote }) });
  }
}

