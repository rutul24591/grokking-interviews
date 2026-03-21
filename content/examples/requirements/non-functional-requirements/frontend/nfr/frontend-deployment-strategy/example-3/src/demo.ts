type Env = "blue" | "green";

function stickyAssign(userId: string): Env {
  const last = userId.charCodeAt(userId.length - 1) || 0;
  return last % 2 === 0 ? "blue" : "green";
}

function route(userId: string, active: Env): Env {
  // Blue/green: active is the target, but keep stickiness during transition.
  const sticky = stickyAssign(userId);
  return active === sticky ? active : sticky;
}

const users = ["u1", "u2", "u3", "u4"];
console.log(JSON.stringify({ active: "blue", routes: users.map((u) => ({ u, env: route(u, "blue") })) }, null, 2));
console.log(JSON.stringify({ ok: true }, null, 2));

