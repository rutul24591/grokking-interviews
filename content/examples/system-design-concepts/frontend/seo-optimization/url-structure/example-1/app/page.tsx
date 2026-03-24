import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">URL structure</h1>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>
          <Link className="text-blue-300 hover:underline" href="/posts/42/old-slug">
            Non-canonical slug (redirect)
          </Link>
        </li>
        <li>
          <Link className="text-blue-300 hover:underline" href="/posts/42/edge-cache-for-staff">
            Canonical URL
          </Link>
        </li>
      </ul>
    </main>
  );
}

