import { expect, test } from "@playwright/test";

test("quote flow computes a total", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Quantity").fill("3");
  await page.getByLabel("Promo code (optional)").fill("SAVE10");
  await page.getByRole("button", { name: "Get quote" }).click();
  await expect(page.getByText("Quote")).toBeVisible();
  await expect(page.getByText("Total:")).toBeVisible();
});

