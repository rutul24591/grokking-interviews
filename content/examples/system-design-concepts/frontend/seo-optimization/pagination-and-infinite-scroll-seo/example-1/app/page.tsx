import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Pagination demo</h1>
      <Link className="text-blue-300 hover:underline" href="/blog/page/1">
        Open blog
      </Link>
    </main>
  );
}

