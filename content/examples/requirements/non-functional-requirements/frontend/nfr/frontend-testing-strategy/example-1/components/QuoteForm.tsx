"use client";

import { useMemo, useState } from "react";
import { QuoteInputSchema, type QuoteInput } from "@/lib/quote";

type QuoteResponse =
  | { ok: true; quote: { totalCents: number; breakdown: Record<string, number> }; requestId: string | null }
  | { error: string; details?: unknown };

function fmtCents(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function QuoteForm() {
  const [quantity, setQuantity] = useState("1");
  const [region, setRegion] = useState<QuoteInput["region"]>("us");
  const [promoCode, setPromoCode] = useState("");
  const [result, setResult] = useState<QuoteResponse | null>(null);
  const [busy, setBusy] = useState(false);

  const input: QuoteInput = useMemo(
    () => ({ quantity: Number(quantity), region, promoCode: promoCode.trim() || undefined }),
    [quantity, region, promoCode],
  );

  const validation = useMemo(() => QuoteInputSchema.safeParse(input), [input]);

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-4">
      <h2 className="font-medium">Get a quote</h2>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-1 text-sm">
          <div className="text-slate-300">Quantity</div>
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2"
            value={quantity}
            inputMode="numeric"
            onChange={(e) => setQuantity(e.target.value)}
            aria-invalid={!validation.success}
          />
        </label>

        <label className="space-y-1 text-sm">
          <div className="text-slate-300">Region</div>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2"
            value={region}
            onChange={(e) => setRegion(e.target.value as QuoteInput["region"])}
          >
            <option value="us">US</option>
            <option value="eu">EU</option>
            <option value="in">IN</option>
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <div className="text-slate-300">Promo code (optional)</div>
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="SAVE10"
          />
        </label>
      </div>

      {!validation.success ? (
        <div className="rounded-lg border border-rose-800 bg-rose-950/30 p-3 text-sm">
          <div className="font-medium text-rose-200">Fix input</div>
          <pre className="mt-2 text-xs text-rose-100/90 overflow-auto">
            {JSON.stringify(validation.error.issues, null, 2)}
          </pre>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <button
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
          disabled={!validation.success || busy}
          onClick={async () => {
            setBusy(true);
            setResult(null);
            try {
              const res = await fetch("/api/quote", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ ...validation.data, requestId: "req_" + crypto.randomUUID() }),
              });
              const body = (await res.json()) as QuoteResponse;
              setResult(body);
            } catch (e) {
              setResult({ error: "network_error", details: String(e) });
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Quoting…" : "Get quote"}
        </button>
        <button
          className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
          onClick={() => {
            setQuantity("1");
            setRegion("us");
            setPromoCode("");
            setResult(null);
          }}
        >
          Reset
        </button>
      </div>

      {result ? (
        "ok" in result && result.ok ? (
          <div className="rounded-lg border border-emerald-800 bg-emerald-950/25 p-3 text-sm">
            <div className="font-medium text-emerald-200">Quote</div>
            <div className="mt-2 text-slate-200">
              Total: <span className="font-semibold">{fmtCents(result.quote.totalCents)}</span>
            </div>
            <pre className="mt-2 rounded bg-slate-950/40 p-3 text-xs overflow-auto">
              {JSON.stringify(result.quote.breakdown, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="rounded-lg border border-rose-800 bg-rose-950/30 p-3 text-sm">
            <div className="font-medium text-rose-200">Error</div>
            <pre className="mt-2 rounded bg-slate-950/40 p-3 text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )
      ) : null}
    </section>
  );
}

