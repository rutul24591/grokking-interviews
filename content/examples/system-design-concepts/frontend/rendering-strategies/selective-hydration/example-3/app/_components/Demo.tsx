"use client";

import { Suspense } from "react";
import Comments from "@/app/_components/Comments";
import SearchBox from "@/app/_components/SearchBox";
import { suspendOnClient } from "@/lib/clientSuspend";

function Delay({ ms, children }: { ms: number; children: React.ReactNode }) {
  suspendOnClient("comments-delay", ms);
  return children;
}

export default function Demo(props: { mode: "coarse" | "fine" }) {
  const comments = (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200">
          Comments hydrating… (3s)
        </div>
      }
    >
      <Delay ms={3000}>
        <Comments />
      </Delay>
    </Suspense>
  );

  if (props.mode === "coarse") {
    return (
      <Suspense
        fallback={
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200">
            Coarse boundary hydrating… (blocks Search + Comments)
          </div>
        }
      >
        <Delay ms={3000}>
          <div className="grid gap-4 md:grid-cols-2">
            <SearchBox />
            <Comments />
          </div>
        </Delay>
      </Suspense>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SearchBox />
      {comments}
    </div>
  );
}

