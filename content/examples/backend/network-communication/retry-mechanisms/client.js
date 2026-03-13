import fetch from "node-fetch";

async function submitOrder() {
  const key = "order-123";
  const payload = { sku: "shoe-1", qty: 1 };
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const res = await fetch("http://localhost:4300/orders", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": key,
        },
        body: JSON.stringify(payload),
      });
      if (res.status === 201 || res.status === 200) {
        console.log("order ok");
        return;
      }
    } catch (err) {
      const backoff = 100 * attempt;
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
}

submitOrder();