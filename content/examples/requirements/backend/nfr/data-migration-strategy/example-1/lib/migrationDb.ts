import { randomUUID } from "node:crypto";

type LegacyUser = { id: string; email: string; fullName: string };
type NewUser = { id: string; email: string; firstName: string; lastName: string; migratedAt: string };

export type MigrationPhase = "legacy" | "dual_write" | "read_new" | "cutover";

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/g);
  if (parts.length === 1) return { firstName: parts[0]!, lastName: "" };
  return { firstName: parts[0]!, lastName: parts.slice(1).join(" ") };
}

class MigrationDb {
  phase: MigrationPhase = "legacy";
  legacy = new Map<string, LegacyUser>();
  next = new Map<string, NewUser>();

  setPhase(phase: MigrationPhase) {
    this.phase = phase;
  }

  createUser(input: { email: string; fullName: string }) {
    const id = randomUUID();
    const legacy: LegacyUser = { id, email: input.email, fullName: input.fullName };
    const { firstName, lastName } = splitName(input.fullName);
    const next: NewUser = { id, email: input.email, firstName, lastName, migratedAt: new Date().toISOString() };

    if (this.phase === "legacy") {
      this.legacy.set(id, legacy);
    } else if (this.phase === "dual_write") {
      this.legacy.set(id, legacy);
      this.next.set(id, next);
    } else {
      this.next.set(id, next);
    }

    return { id, phase: this.phase };
  }

  backfill(batchSize: number) {
    const toMigrate = [...this.legacy.values()].filter((u) => !this.next.has(u.id)).slice(0, batchSize);
    for (const u of toMigrate) {
      const { firstName, lastName } = splitName(u.fullName);
      this.next.set(u.id, {
        id: u.id,
        email: u.email,
        firstName,
        lastName,
        migratedAt: new Date().toISOString()
      });
    }
    return { migrated: toMigrate.length };
  }

  getUser(id: string) {
    if (this.phase === "legacy") {
      const u = this.legacy.get(id);
      return u ? { source: "legacy" as const, user: u } : null;
    }

    const u2 = this.next.get(id);
    if (u2) return { source: "new" as const, user: u2 };

    if (this.phase === "read_new") {
      // Fallback during migration window.
      const u = this.legacy.get(id);
      return u ? { source: "legacy_fallback" as const, user: u } : null;
    }

    return null;
  }
}

export const db = new MigrationDb();

