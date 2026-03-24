import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { TextField } from "@/ui/TextField";

export default function SettingsPage() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-[var(--muted)]">Another composition example using the same primitives.</p>
      </header>

      <Card title="Profile" description="Design systems should avoid repeated bespoke styling per page.">
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextField label="Display name" defaultValue="Aurora" />
          <TextField label="Handle" defaultValue="@aurora" help="Used in URLs and mentions." />
        </div>
        <div className="mt-6 flex gap-3">
          <Button>Save</Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      </Card>
    </main>
  );
}

