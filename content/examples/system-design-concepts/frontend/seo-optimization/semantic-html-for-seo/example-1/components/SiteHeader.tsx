import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-black/30">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <p className="text-sm font-semibold tracking-tight text-slate-100">
          <Link href="/" className="hover:underline">
            Semantic HTML Demo
          </Link>
        </p>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-4 text-sm text-slate-300">
            <li>
              <Link className="hover:text-slate-100" href="/">
                Articles
              </Link>
            </li>
            <li>
              <a className="hover:text-slate-100" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element">
                HTML elements (MDN)
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

