import { z } from "zod";
import { stableFloat01 } from "@/lib/hash";

export type UserContext = {
  userId: string;
  country: "US" | "IN" | "GB" | "DE" | "BR";
};

type FlagValue = boolean | string;

type Rule =
  | { type: "countryIn"; countries: UserContext["country"][]; value: FlagValue }
  | { type: "userIn"; userIds: string[]; value: FlagValue }
  | { type: "percent"; percent: number; value: FlagValue };

type Flag = {
  key: string;
  defaultValue: FlagValue;
  rules: Rule[];
};

const Flags: Flag[] = [
  {
    key: "checkout.newFlow",
    defaultValue: false,
    rules: [
      // Target an early market first.
      { type: "countryIn", countries: ["US", "GB"], value: true },
      // Then roll out gradually.
      { type: "percent", percent: 25, value: true }
    ]
  },
  {
    key: "nav.variant",
    defaultValue: "old",
    rules: [{ type: "percent", percent: 40, value: "new" }]
  }
];

const FlagKeySchema = z.enum(["checkout.newFlow", "nav.variant"]);
export type FlagKey = z.infer<typeof FlagKeySchema>;
export type EvaluatedFlags = Record<FlagKey, FlagValue>;

const OpsOverrides: Partial<Record<FlagKey, FlagValue>> = {
  // Example kill-switch: uncomment to force-disable new checkout.
  // "checkout.newFlow": false,
};

function matchesRule(rule: Rule, ctx: { user: UserContext }, key: string) {
  if (rule.type === "countryIn") return rule.countries.includes(ctx.user.country);
  if (rule.type === "userIn") return rule.userIds.includes(ctx.user.userId);
  if (rule.type === "percent") {
    const p = Math.max(0, Math.min(100, rule.percent));
    const bucket = stableFloat01(`${key}:${ctx.user.userId}`);
    return bucket < p / 100;
  }
  return false;
}

export function evaluateFlag(key: FlagKey, ctx: { user: UserContext }): FlagValue {
  const forced = OpsOverrides[key];
  if (forced !== undefined) return forced;

  const flag = Flags.find((f) => f.key === key);
  if (!flag) throw new Error(`Unknown flag: ${key}`);

  for (const rule of flag.rules) {
    if (matchesRule(rule, ctx, key)) return rule.value;
  }
  return flag.defaultValue;
}

export function evaluateAllFlags(ctx: { user: UserContext }): EvaluatedFlags {
  const out = {} as EvaluatedFlags;
  for (const f of Flags) {
    const key = FlagKeySchema.parse(f.key);
    out[key] = evaluateFlag(key, ctx);
  }
  return out;
}

