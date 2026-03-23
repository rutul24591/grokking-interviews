import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="max-w-3xl p-6 text-center sm:px-12">
        {/* Hero Icon */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-accent shadow-soft-theme">
            <span className="text-5xl font-bold text-white">IP</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl font-bold text-heading sm:text-5xl">
          Master System Design &amp; Technical Interviews
        </h1>

        {/* Tagline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl">
          Deep-dive articles, architecture diagrams, and real-world code
          examples for senior, staff, and principal engineers preparing for
          technical interviews.
        </p>

        {/* Value Propositions */}
        <div className="mx-auto mt-10 grid max-w-2xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-theme bg-panel-soft p-6 text-left">
            <div className="mb-3 text-2xl">🏗️</div>
            <h3 className="font-semibold text-heading">
              Architecture Deep Dives
            </h3>
            <p className="mt-2 text-sm text-muted">
              Understand system design at scale with detailed architecture
              diagrams.
            </p>
          </div>

          <div className="rounded-2xl border border-theme bg-panel-soft p-6 text-left">
            <div className="mb-3 text-2xl">💻</div>
            <h3 className="font-semibold text-heading">
              Real-World Code Examples
            </h3>
            <p className="mt-2 text-sm text-muted">
              Production-ready code examples with full explanations and
              trade-offs.
            </p>
          </div>

          <div className="rounded-2xl border border-theme bg-panel-soft p-6 text-left">
            <div className="mb-3 text-2xl">🎯</div>
            <h3 className="font-semibold text-heading">Interview Focused</h3>
            <p className="mt-2 text-sm text-muted">
              Curated content specifically for staff/principal engineer
              interviews.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        {/* <div className="mt-12">
          <Link
            href="/articles/system-design-concepts/frontend-concepts/rendering-strategies/client-side-rendering"
            className="inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-lg font-semibold text-white shadow-soft-theme transition hover:bg-accent/90 hover:shadow-strong-theme focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Explore Content
            <span aria-hidden="true">→</span>
          </Link>
        </div> */}

        {/* Additional Info */}
        <div className="mt-12 border-t border-theme pt-8">
          <p className="text-sm text-muted">
            Use the sidebar to navigate through{" "}
            <strong className="text-heading">System Design Concepts</strong>,{" "}
            <strong className="text-heading">Requirements</strong>, and more.
            Content is continuously expanding.
          </p>
        </div>
      </div>
    </div>
  );
}
