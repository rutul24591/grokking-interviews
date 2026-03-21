import { z } from "zod";

export type HostEvent =
  | { type: "navigate"; to: string; ts: string; remote: string }
  | { type: "telemetry"; name: string; value: number; ts: string; remote: string }
  | { type: "error"; message: string; ts: string; remote: string };

export const RemoteHelloSchema = z.object({
  remote: z.string().min(1),
  remoteVersion: z.coerce.number().int().min(1),
});

type Listener = (e: HostEvent) => void;

export type HostContractV1 = {
  version: 1;
  hello: (payload: { remote: string; remoteVersion: number }) => { ok: true; hostVersion: 1 };
  getAuthToken: () => Promise<string>;
  emit: (e: Omit<HostEvent, "ts">) => void;
};

export type HostContractV2 = {
  version: 2;
  hello: (payload: { remote: string; remoteVersion: number }) => { ok: true; hostVersion: 2; compat: "full" | "shim" };
  getAuthToken: (audience?: string) => Promise<string>;
  emit: (e: Omit<HostEvent, "ts">) => void;
};

export type HostContract = HostContractV1 | HostContractV2;

export function installHostContract(params: {
  onEvent: Listener;
  fetchToken: (audience?: string) => Promise<string>;
}) {
  const contract: HostContractV2 = {
    version: 2,
    hello: (payload) => {
      const parsed = RemoteHelloSchema.parse(payload);
      const compat = parsed.remoteVersion >= 2 ? "full" : "shim";
      contract.emit({ type: "telemetry", name: "remote_hello", value: parsed.remoteVersion, remote: parsed.remote });
      return { ok: true, hostVersion: 2, compat };
    },
    getAuthToken: async (audience?: string) => params.fetchToken(audience),
    emit: (e) => params.onEvent({ ...e, ts: new Date().toISOString() }),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__MF_HOST__ = contract;
  return contract;
}

