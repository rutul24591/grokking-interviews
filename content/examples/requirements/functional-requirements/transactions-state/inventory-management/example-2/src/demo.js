function chooseInventoryPath(items) {
  return items.map((item) => ({
    id: item.id,
    reserveNow: item.available > 0 && !item.oversellRisk,
    allowBackorder: item.available === 0 && item.backorderEligible,
    blockCheckout: item.available === 0 && !item.backorderEligible
  }));
}

console.log(chooseInventoryPath([
  { id: "sku-1", available: 4, oversellRisk: false, backorderEligible: false },
  { id: "sku-2", available: 0, oversellRisk: true, backorderEligible: true }
]));
