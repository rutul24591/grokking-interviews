import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { Specs } from "@/components/Specs";
import { getProduct } from "@/lib/product";

export default function Page() {
  const product = getProduct();

  return (
    <>
      <nav aria-label="Primary" className="mb-8 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-100">Semantic patterns</p>
        <ul className="flex items-center gap-4 text-sm text-slate-300">
          <li>
            <a className="hover:text-slate-100" href="#faq">
              FAQ
            </a>
          </li>
          <li>
            <a className="hover:text-slate-100" href="#specs">
              Specs
            </a>
          </li>
        </ul>
      </nav>

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/" },
          { label: product.name }
        ]}
      />

      <main>
        <article className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-slate-300">{product.tagline}</p>
            <p className="mt-4 text-sm text-slate-300">
              <span className="font-semibold text-slate-100">${product.priceUsd}</span> · Ships in{" "}
              <time dateTime="P2D">2 days</time>
            </p>
          </header>

          <figure className="mt-6 rounded-lg border border-white/10 bg-black/30 p-4">
            <div className="aspect-[16/7] w-full rounded-md bg-gradient-to-br from-indigo-500/40 via-sky-500/20 to-fuchsia-500/30" />
            <figcaption className="mt-3 text-sm text-slate-300">
              Product hero image (placeholder). Use <code>&lt;figcaption&gt;</code> to describe the media meaningfully.
            </figcaption>
          </figure>

          <section aria-labelledby="overview" className="mt-8">
            <h2 id="overview" className="text-xl font-semibold">
              Overview
            </h2>
            <p className="mt-2 text-slate-200">{product.description}</p>
          </section>

          <section aria-labelledby="specs" className="mt-8">
            <h2 id="specs" className="text-xl font-semibold">
              Specifications
            </h2>
            <Specs specs={product.specs} />
          </section>

          <section aria-labelledby="faq" className="mt-8">
            <h2 id="faq" className="text-xl font-semibold">
              FAQ
            </h2>
            <FAQ items={product.faq} />
          </section>

          <footer className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-300">
            <p>
              The “content shape” is explicit: headings for sections, a <code>&lt;dl&gt;</code> for specs, and
              crawlable FAQ using <code>&lt;details&gt;</code>.
            </p>
          </footer>
        </article>
      </main>

      <aside className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">Edge-case note</h2>
        <p className="mt-2">
          Avoid nesting <code>&lt;main&gt;</code> inside components. Keep landmarks at the page/layout level and use{" "}
          <code>&lt;section&gt;</code> inside the main content region.
        </p>
        <p className="mt-2">
          Don’t add ARIA roles that duplicate native semantics (e.g. <code>role=&quot;navigation&quot;</code> on{" "}
          <code>&lt;nav&gt;</code>).
        </p>
        <p className="mt-3">
          Continue:{" "}
          <Link className="hover:underline" href="/">
            refresh
          </Link>
        </p>
      </aside>
    </>
  );
}

