const failures = [false, true, true, true, false];
let state = "closed";
let streak = 0;
for (const failed of failures) {
  if (state === "open") { console.log("open -> reject"); continue; }
  streak = failed ? streak + 1 : 0;
  if (streak >= 3) state = "open";
  console.log(`${failed ? "fail" : "success"} -> ${state}`);
}
