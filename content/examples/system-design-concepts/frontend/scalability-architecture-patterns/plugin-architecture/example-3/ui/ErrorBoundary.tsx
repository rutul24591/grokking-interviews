"use client";

import type { ReactNode } from "react";
import { Component } from "react";

export class ErrorBoundary extends Component<
  { pluginId: string; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <section className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-5 text-sm text-rose-100">
          <h3 className="font-semibold">Plugin crashed: {this.props.pluginId}</h3>
          <p className="mt-2">{this.state.error.message}</p>
        </section>
      );
    }
    return this.props.children;
  }
}

