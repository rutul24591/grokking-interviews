"use client";

import { useState } from "react";

type SignalMessage = {
  id: number;
  to: "offerer" | "answerer";
  type: "offer" | "answer" | "candidate";
  payload: string;
};

export default function PeerRoomBoard() {
  const [status, setStatus] = useState("idle");
  const [messages, setMessages] = useState<string[]>([]);

  async function connectPeers() {
    setStatus("resetting room");
    setMessages([]);
    await fetch("http://localhost:4450/rooms/article-room/reset", { method: "POST" });

    const offerer = new RTCPeerConnection();
    const answerer = new RTCPeerConnection();
    const dataChannel = offerer.createDataChannel("article-room");
    let nextOffererCursor = 0;
    let nextAnswererCursor = 0;
    let answerResolved = false;

    function log(message: string) {
      setMessages((current) => [message, ...current].slice(0, 12));
    }

    async function postSignal(to: "offerer" | "answerer", type: SignalMessage["type"], payload: string) {
      await fetch("http://localhost:4450/rooms/article-room/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, type, payload })
      });
    }

    async function readSignals(to: "offerer" | "answerer", after: number) {
      const response = await fetch(`http://localhost:4450/rooms/article-room/signals?to=${to}&after=${after}`, { cache: "no-store" });
      return (await response.json()) as { items: SignalMessage[] };
    }

    offerer.onicecandidate = async (event) => {
      if (event.candidate) {
        await postSignal("answerer", "candidate", JSON.stringify(event.candidate.toJSON()));
      }
    };

    answerer.onicecandidate = async (event) => {
      if (event.candidate) {
        await postSignal("offerer", "candidate", JSON.stringify(event.candidate.toJSON()));
      }
    };

    answerer.ondatachannel = (event) => {
      event.channel.onmessage = (messageEvent) => {
        log(`answerer received -> ${String(messageEvent.data)}`);
      };
      event.channel.onopen = () => {
        log("answerer data channel open");
      };
    };

    dataChannel.onopen = () => {
      setStatus("peer connected");
      log("offerer data channel open");
      dataChannel.send("peer-to-peer article sync ready");
    };
    dataChannel.onmessage = (event) => {
      log(`offerer received -> ${String(event.data)}`);
    };

    setStatus("creating offer");
    const offer = await offerer.createOffer();
    await offerer.setLocalDescription(offer);
    await postSignal("answerer", "offer", JSON.stringify(offer));
    log("offer posted through signaling API");

    let guard = 0;
    while (!answerResolved && guard < 40) {
      guard += 1;

      const answererSignals = await readSignals("answerer", nextAnswererCursor);
      for (const message of answererSignals.items) {
        nextAnswererCursor = message.id;
        if (message.type === "offer") {
          const remoteOffer = JSON.parse(message.payload);
          await answerer.setRemoteDescription(remoteOffer);
          const answer = await answerer.createAnswer();
          await answerer.setLocalDescription(answer);
          await postSignal("offerer", "answer", JSON.stringify(answer));
          log("answer generated and posted");
        }
        if (message.type === "candidate") {
          await answerer.addIceCandidate(JSON.parse(message.payload));
          log("answerer added remote ICE candidate");
        }
      }

      const offererSignals = await readSignals("offerer", nextOffererCursor);
      for (const message of offererSignals.items) {
        nextOffererCursor = message.id;
        if (message.type === "answer") {
          await offerer.setRemoteDescription(JSON.parse(message.payload));
          answerResolved = true;
          log("offerer applied answer");
        }
        if (message.type === "candidate") {
          await offerer.addIceCandidate(JSON.parse(message.payload));
          log("offerer added remote ICE candidate");
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 120));
    }

    setStatus(answerResolved ? "negotiation complete" : "negotiation timed out");
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Peer room state</h2>
        <p className="mt-2 text-sm text-slate-600">Current state: {status}</p>
        <button onClick={() => void connectPeers()} className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          Start local peer negotiation
        </button>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Signaling and peer events</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {messages.map((message) => (
            <li key={message} className="rounded-2xl bg-slate-50 px-4 py-3">
              {message}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
