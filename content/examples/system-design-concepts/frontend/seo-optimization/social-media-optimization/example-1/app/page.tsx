import Link from "next/link";
import { listPosts } from "@/lib/posts";

export default async function Page() {
  const posts = await listPosts();
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Social media optimization</h1>
      <p className="text-sm opacity-80">
        Each post page sets Open Graph + Twitter tags and references a generated PNG OG image.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link className="text-blue-300 hover:underline" href={`/posts/${p.slug}`}>
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

