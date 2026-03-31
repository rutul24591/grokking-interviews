"use client";

import { useMemo, useState } from "react";

type UploadedPart = {
  partNumber: number;
  bytes: number;
  status: "pending" | "uploaded";
};

const sampleBody = Array.from({ length: 36 }, (_, index) => `Line ${index + 1}: image metadata and article annotations.`).join("\n");

export default function MultipartUploader() {
  const [parts, setParts] = useState<UploadedPart[]>([]);
  const [status, setStatus] = useState("idle");

  const chunks = useMemo(() => {
    const chunkSize = 180;
    return sampleBody.match(new RegExp(`.{1,${chunkSize}}`, "gs")) ?? [];
  }, []);

  async function startUpload() {
    setStatus("creating upload");
    const upload = await fetch("http://localhost:4370/uploads/start", { method: "POST" }).then((response) => response.json()) as { uploadId: string };
    const nextParts: UploadedPart[] = chunks.map((chunk, index) => ({
      partNumber: index + 1,
      bytes: chunk.length,
      status: "pending"
    }));
    setParts(nextParts);

    for (const [index, chunk] of chunks.entries()) {
      setStatus(`uploading part ${index + 1}`);
      await fetch(`http://localhost:4370/uploads/${upload.uploadId}/parts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partNumber: index + 1, content: chunk })
      });
      setParts((current) =>
        current.map((part) => (part.partNumber === index + 1 ? { ...part, status: "uploaded" } : part))
      );
    }

    setStatus("finalizing upload");
    await fetch(`http://localhost:4370/uploads/${upload.uploadId}/complete`, { method: "POST" });
    setStatus("upload complete");
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Upload plan</h2>
        <p className="mt-2 text-sm text-slate-600">The content is split into {chunks.length} parts so failed chunks can be retried independently.</p>
        <button onClick={() => void startUpload()} className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          Start multipart upload
        </button>
        <p className="mt-4 text-sm text-slate-700">{status}</p>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Part status</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {parts.map((part) => (
            <li key={part.partNumber} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <span>Part {part.partNumber}</span>
              <span>{part.bytes} bytes · {part.status}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
