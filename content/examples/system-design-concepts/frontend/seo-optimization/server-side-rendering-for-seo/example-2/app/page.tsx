import Link from "next/link";
import { listPostSlugs } from "@/lib/posts";

export default function Page() {
  const slugs = listPostSlugs();

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">SSR optimization primitives</h1>
        <p className="mt-2 text-slate-300">
          Open a post page and check that metadata and content are both derived from the same cached server loader.
        </p>
      </header>

      <section aria-labelledby="posts">
        <h2 id="posts" className="text-xl font-semibold">
          Posts
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          {slugs.map((slug) => (
            <li key={slug}>
              <Link className="hover:underline" href={`/posts/${slug}`}>
                {slug}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

