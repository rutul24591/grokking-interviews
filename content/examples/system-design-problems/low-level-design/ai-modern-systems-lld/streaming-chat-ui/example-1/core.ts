export type Chunk = { kind: "token" | "done" | "error"; text?: string };

export type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

export type ChatState = {
  messages: ChatMessage[];
  streaming: boolean;
  buffer: string;
  requestId: number;
};

export function create() {
  return { messages: [], streaming: false, buffer: "", requestId: 0 } satisfies ChatState;
}

export async function runStream(args: {
  state: ChatState;
  prompt: string;
  stream: (signal: AbortSignal) => AsyncGenerator<Chunk, void, void>;
  onState: (s: ChatState) => void;
}) {
  const rid = args.state.requestId + 1;
  let s: ChatState = { ...args.state, requestId: rid, streaming: true, buffer: "" };
  args.onState(s);
  const ac = new AbortController();

  for await (const c of args.stream(ac.signal)) {
    if (s.requestId !== rid) break;
    if (c.kind === "token") {
      s = { ...s, buffer: s.buffer + (c.text ?? "") };
      args.onState(s);
    } else if (c.kind === "done") {
      s = {
        ...s,
        streaming: false,
        messages: [...s.messages, { id: `a:${Date.now()}`, role: "assistant", text: s.buffer }],
        buffer: "",
      };
      args.onState(s);
    }
  }
}
