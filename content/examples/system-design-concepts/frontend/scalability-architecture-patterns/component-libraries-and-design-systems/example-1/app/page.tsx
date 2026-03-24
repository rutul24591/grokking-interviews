import Link from "next/link";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { TextField } from "@/ui/TextField";

export default function Page() {
  return (
    <main className="space-y-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Component library catalog</h1>
        <p className="mt-2 text-[var(--muted)]">
          A design system scales teams by standardizing behavior + accessibility, not just visuals.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Buttons" description="Variants, sizes, disabled semantics, focus ring.">
          <div className="mt-4 flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Card>

        <Card title="Form fields" description="Label wiring + help/error slots + aria defaults.">
          <div className="mt-4 space-y-4">
            <TextField label="Email" placeholder="name@company.com" help="We use this for account recovery." />
            <TextField label="Team" placeholder="Platform" error="Team is required." defaultValue="" />
          </div>
        </Card>

        <Card title="Composition" description="Primitives should compose into real flows.">
          <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <p>
              Open{" "}
              <Link className="hover:underline" href="/checkout">
                Checkout
              </Link>{" "}
              to see how primitives build a real page.
            </p>
            <p>
              Open{" "}
              <Link className="hover:underline" href="/settings">
                Settings
              </Link>{" "}
              for another composition example.
            </p>
          </div>
        </Card>
      </section>

      <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--panel)] p-6 text-sm text-[var(--muted)]">
        <h2 className="text-base font-semibold text-[var(--text)]">Staff-level guidance</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Ship primitives with accessibility defaults so product teams can’t forget them.</li>
          <li>Prefer tokens and composition; avoid 200-prop “do everything” components.</li>
          <li>Version and deprecate carefully; the design system is platform infrastructure.</li>
        </ul>
      </section>
    </main>
  );
}

