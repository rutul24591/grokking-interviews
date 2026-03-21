import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuoteForm } from "@/components/QuoteForm";

describe("QuoteForm", () => {
  it("renders a quote after calling the API", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          ok: true,
          quote: { totalCents: 1234, breakdown: { subtotal: 1000, discount: 0, tax: 234 } },
          requestId: "req_test",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    render(<QuoteForm />);
    await user.clear(screen.getByLabelText("Quantity"));
    await user.type(screen.getByLabelText("Quantity"), "2");
    await user.click(screen.getByRole("button", { name: "Get quote" }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Quote")).toBeVisible();
    expect(await screen.findByText(/Total:/)).toBeVisible();
  });
});

