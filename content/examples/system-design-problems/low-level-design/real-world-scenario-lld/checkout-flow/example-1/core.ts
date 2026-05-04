export type Step = "cart" | "address" | "payment" | "review" | "done";
export type Checkout = { step: Step; requestId: number; error: string | null };

export function next(step: Step): Step {
  return step === "cart" ? "address" : step === "address" ? "payment" : step === "payment" ? "review" : step === "review" ? "done" : "done";
}
