import { z } from "zod";

export const HostToRemoteSchema = z.discriminatedUnion("type", [
  z.object({
    v: z.literal(1),
    type: z.literal("host:handshake"),
    payload: z.object({ supported: z.array(z.literal(1)).min(1) })
  })
]);
export type HostToRemote = z.infer<typeof HostToRemoteSchema>;

export const RemoteToHostSchema = z.discriminatedUnion("type", [
  z.object({
    v: z.literal(1),
    type: z.literal("remote:handshakeAck"),
    payload: z.object({ accepted: z.boolean() })
  })
]);
export type RemoteToHost = z.infer<typeof RemoteToHostSchema>;

