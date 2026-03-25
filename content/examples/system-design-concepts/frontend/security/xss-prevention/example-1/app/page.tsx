"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { markdownSanitizeSchema } from "../lib/sanitizeSchema";

const PAYLOADS: Array<{ label: string; value: string }> = [
  { label: "Benign markdown", value: "Hello **world**!\n\n- item 1\n- item 2\n\n[OpenAI](https://openai.com)" },
  { label: "Script tag", value: "Hi<script>alert('xss')</script>" },
  { label: "IMG onerror", value: "<img src=x onerror=alert('xss') />" },
  { label: "Javascript URL", value: "[click](javascript:alert('xss'))" }
];

export default function Page() {
  const [text, setText] = useState(PAYLOADS[0]?.value ?? "");
  const rendered = useMemo(() => text, [text]);

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">XSS prevention: safe rich text rendering</h1>
        <p className="text-sm text-white/70">
          Render untrusted content with a constrained pipeline (Markdown + sanitize). Avoid raw HTML execution paths.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Input</h2>
            <div className="flex flex-wrap gap-2">
              {PAYLOADS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setText(p.value)}
                  className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-3 h-56 w-full resize-none rounded-md border border-white/10 bg-black/20 p-3 text-sm outline-none"
          />
          <p className="mt-3 text-xs text-white/50">
            Production note: still validate on the server, log abuse, and layer CSP.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-sm font-semibold">Safe render (Markdown + sanitize)</h2>
          <div className="prose prose-invert mt-3 max-w-none rounded-md border border-white/10 bg-black/20 p-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeSanitize, markdownSanitizeSchema]]}>
              {rendered}
            </ReactMarkdown>
          </div>
          <p className="mt-3 text-xs text-white/50">
            If you used <code>dangerouslySetInnerHTML</code> here, payloads could execute in the browser.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-sm font-semibold">Raw string (React escapes by default)</h2>
        <div className="mt-3 rounded-md border border-white/10 bg-black/20 p-3 text-sm whitespace-pre-wrap">{text}</div>
      </section>
    </main>
  );
}

