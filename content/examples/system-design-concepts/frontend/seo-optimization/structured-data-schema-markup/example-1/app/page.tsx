import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Structured data</h1>
      <p className="text-sm opacity-80">
        This demo embeds JSON-LD for an Article and a BreadcrumbList.
      </p>
      <Link className="text-blue-300 hover:underline" href="/articles/edge-cache">
        Open sample article
      </Link>
    </main>
  );
}

