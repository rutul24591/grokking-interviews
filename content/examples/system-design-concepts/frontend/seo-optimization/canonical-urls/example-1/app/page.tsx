import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Canonical URL patterns</h1>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>
          <Link className="text-blue-300 hover:underline" href="/products?utm_source=twitter&sort=price">
            Products with tracking params
          </Link>
        </li>
        <li>
          <Link className="text-blue-300 hover:underline" href="/products?sort=relevance">
            Products sorted by relevance
          </Link>
        </li>
      </ul>
    </main>
  );
}

