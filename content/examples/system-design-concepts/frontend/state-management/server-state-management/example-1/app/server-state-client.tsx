"use client";

import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const client = new QueryClient();

async function fetchTickets() {
  const response = await fetch('/api/tickets');
  return response.json();
}

function TicketsBoard() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const { data = [], isFetching } = useQuery({ queryKey: ['tickets'], queryFn: fetchTickets, staleTime: 15_000 });
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch('/api/tickets', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }) });
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] })
  });

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Server state management</p>
        <h1 className="mt-2 text-3xl font-semibold">Incident board</h1>
        <p className="mt-2 text-sm text-slate-400">Data is fetched, cached, and invalidated; the client never pretends it owns the source of truth.</p>
        <div className="mt-4 text-sm text-slate-400">{isFetching ? 'Refreshing from API…' : 'Serving from query cache until stale or invalidated.'}</div>
        <div className="mt-6 grid gap-3">
          {data.map((ticket: any) => (
            <button key={ticket.id} className={`rounded-2xl border px-4 py-4 text-left ${selected === ticket.id ? 'border-emerald-400 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/60'}`} onClick={() => setSelected(ticket.id)}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium">{ticket.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">Status: {ticket.status}</p>
                </div>
                <button className="rounded-xl bg-emerald-400 px-3 py-2 font-medium text-slate-950" onClick={(event) => { event.stopPropagation(); mutation.mutate(ticket.id); }}>Advance</button>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export function ServerStateClient() {
  return <QueryClientProvider client={client}><TicketsBoard /></QueryClientProvider>;
}
