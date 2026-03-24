import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { TextField } from "@/ui/TextField";

export default function CheckoutPage() {
  return (
    <main className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="space-y-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
          <p className="mt-2 text-[var(--muted)]">A “real” page composed from design system primitives.</p>
        </header>

        <Card title="Shipping" description="Fields are labelled and wired with help/error semantics.">
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextField label="Full name" placeholder="Alex Johnson" />
            <TextField label="Email" placeholder="name@company.com" />
            <div className="md:col-span-2">
              <TextField label="Address" placeholder="123 Main St" />
            </div>
          </div>
        </Card>

        <Card title="Payment" description="Use <button> and real input types; don’t fake semantics.">
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextField label="Card number" placeholder="4242 4242 4242 4242" />
            <TextField label="Expiry" placeholder="MM/YY" />
          </div>
          <div className="mt-6 flex gap-3">
            <Button>Pay</Button>
            <Button variant="secondary">Save for later</Button>
          </div>
        </Card>
      </section>

      <aside className="space-y-4">
        <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--panel)] p-6">
          <h2 className="text-base font-semibold text-[var(--text)]">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <div className="flex items-center justify-between">
              <dt>Subtotal</dt>
              <dd className="text-[var(--text)]">$79.00</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Shipping</dt>
              <dd className="text-[var(--text)]">$0.00</dd>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-2">
              <dt>Total</dt>
              <dd className="text-[var(--text)]">$79.00</dd>
            </div>
          </dl>
        </section>
      </aside>
    </main>
  );
}

