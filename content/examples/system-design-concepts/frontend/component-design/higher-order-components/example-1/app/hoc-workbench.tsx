"use client";

import { ComponentType, useCallback, useEffect, useState } from "react";

type Viewer = { role: string; premiumExamples: boolean; experimentEnabled: boolean };
type FeedItem = { title: string; summary: string; premiumOnly: boolean };

function ArticleCard({ title, summary, badge }: { title: string; summary: string; badge?: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
        {badge ? <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">{badge}</span> : null}
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-700">{summary}</p>
    </div>
  );
}

function withEntitlement<T extends object>(Component: ComponentType<T>) {
  return function EntitledComponent(props: T & { viewer: Viewer; premiumOnly?: boolean }) {
    if (props.premiumOnly && !props.viewer.premiumExamples) {
      return <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">Upgrade required to view premium examples.</div>;
    }
    return <Component {...props} />;
  };
}
function withFeatureFlag<T extends object>(Component: ComponentType<T>) {
  return function FlaggedComponent(props: T & { viewer: Viewer; requiredFlag?: "experimentEnabled" }) {
    if (props.requiredFlag && !props.viewer[props.requiredFlag]) {
      return <div className="rounded-3xl border border-slate-200 bg-slate-100 p-6 text-sm text-slate-700">Feature flag disabled for this viewer cohort.</div>;
    }
    return <Component {...props} />;
  };
}
function withAuditLog<T extends object>(Component: ComponentType<T>) {
  return function AuditedComponent(props: T & { onViewed: (title: string) => void; title: string }) {
    useEffect(() => {
      props.onViewed(props.title);
    }, [props.onViewed, props.title]);
    return <Component {...props} />;
  };
}

const ProtectedArticleCard = withAuditLog(withFeatureFlag(withEntitlement(ArticleCard)));

export default function HocWorkbench() {
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    void (async () => {
      const [viewerResponse, feedResponse] = await Promise.all([
        fetch("http://localhost:4526/viewer"),
        fetch("http://localhost:4526/feed")
      ]);
      setViewer((await viewerResponse.json()) as Viewer);
      setFeed((await feedResponse.json()) as FeedItem[]);
    })();
  }, []);

  const onViewed = useCallback(async (title: string) => {
    const response = await fetch("http://localhost:4526/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });
    const result = (await response.json()) as { logs: string[] };
    setLogs(result.logs);
  }, []);

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-semibold text-slate-950">Viewer context</h2>
        <p className="mt-3 text-sm text-slate-700">Role: {viewer?.role}</p>
        <p className="mt-2 text-sm text-slate-700">Premium examples: {viewer?.premiumExamples ? "enabled" : "disabled"}</p>
        <p className="mt-2 text-sm text-slate-700">Experiment enabled: {viewer?.experimentEnabled ? "yes" : "no"}</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{logs.map((log) => <li key={log}>• {log}</li>)}</ul>
      </article>
      <div className="space-y-4">
        {viewer ? feed.map((item) => (
          <ProtectedArticleCard
            key={item.title}
            viewer={viewer}
            title={item.title}
            summary={item.summary}
            premiumOnly={item.premiumOnly}
            requiredFlag={item.premiumOnly ? "experimentEnabled" : undefined}
            badge={item.premiumOnly ? "Premium" : "Free"}
            onViewed={onViewed}
          />
        )) : null}
      </div>
    </section>
  );
}
