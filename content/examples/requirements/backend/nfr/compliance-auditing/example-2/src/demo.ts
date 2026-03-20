import { createHmac } from "node:crypto";

function token(secret: string, value: string) {
  return createHmac("sha256", secret).update(value.trim().toLowerCase()).digest("hex");
}

const secret = "example-secret";
const email = "Alice@Example.com";
const emailToken = token(secret, email);

console.log(
  JSON.stringify(
    {
      raw: { email },
      stored: { emailToken, note: "store emailToken in audit logs; keep raw email in primary user table" }
    },
    null,
    2
  )
);

