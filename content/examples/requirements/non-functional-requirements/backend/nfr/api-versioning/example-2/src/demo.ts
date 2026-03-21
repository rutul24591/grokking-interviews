import { z } from "zod";

const V1 = z.object({ id: z.string(), name: z.string() });
const V2 = z.object({ id: z.string(), givenName: z.string(), familyName: z.string(), email: z.string().email() });

function v2ToV1(v2: z.infer<typeof V2>) {
  return { id: v2.id, name: `${v2.givenName} ${v2.familyName}` };
}

const v2 = { id: "u_1", givenName: "Ada", familyName: "Lovelace", email: "ada@example.com" };
const v1 = v2ToV1(V2.parse(v2));

console.log(JSON.stringify({ v2Valid: V2.safeParse(v2).success, v1, v1Valid: V1.safeParse(v1).success }, null, 2));

