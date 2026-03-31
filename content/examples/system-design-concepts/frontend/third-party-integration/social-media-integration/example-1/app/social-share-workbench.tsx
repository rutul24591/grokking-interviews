"use client";

import { useState } from "react";

type SharePayload = {
  provider: string;
  shareUrl: string;
  previewTitle: string;
  previewDescription: string;
};

export default function SocialShareWorkbench() {
  const [shares, setShares] = useState<SharePayload[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  async function build(provider: string) {
    const payload = (await fetch(`http://localhost:4476/share?provider=${provider}&slug=oauth-integration`).then((response) => response.json())) as SharePayload;
    setShares((current) => [payload, ...current].slice(0, 6));
  }

  async function copyLink() {
    const canonical = "https://systemdesign.example.com/articles/oauth-integration";
    setCopied(canonical);
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Share actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {["linkedin", "x", "facebook"].map((provider) => (
            <button key={provider} onClick={() => void build(provider)} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Share to {provider}
            </button>
          ))}
          <button onClick={() => void copyLink()} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            Copy canonical link
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-600">{copied ? `Copied fallback link: ${copied}` : "Provider popup blocked? Use the copy-link fallback."}</p>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Built payloads</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {shares.map((item) => (
            <li key={`${item.provider}-${item.shareUrl}`} className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="font-medium text-slate-900">{item.provider}</p>
              <p className="mt-1 break-all text-slate-600">{item.shareUrl}</p>
              <p className="mt-1 text-slate-500">{item.previewTitle}</p>
              <p className="mt-1 text-slate-500">{item.previewDescription}</p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
