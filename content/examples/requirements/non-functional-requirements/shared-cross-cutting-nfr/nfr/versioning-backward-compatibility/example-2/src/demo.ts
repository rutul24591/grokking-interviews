import { V1, V2, v1FromV2, v2FromV1 } from "./contracts";

const v1 = V1.parse({ id: "u1", name: "Ada" });
const v2 = v2FromV1(v1);
console.log({ v2 });

const back = v1FromV2(V2.parse({ id: "u1", displayName: "Grace" }));
console.log({ back });

