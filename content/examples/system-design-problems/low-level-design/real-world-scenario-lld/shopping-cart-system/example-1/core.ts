export type CartItem = { sku: string; qty: number; priceCents: number };
export type Cart = { items: CartItem[]; updatedAt: number };

export function addItem(cart: Cart, sku: string, qty: number, priceCents: number) {
  const items = cart.items.slice();
  const idx = items.findIndex((i) => i.sku === sku);
  if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + qty };
  else items.push({ sku, qty, priceCents });
  return { ...cart, items, updatedAt: Date.now() };
}

export function total(cart: Cart) {
  return cart.items.reduce((s, i) => s + i.qty * i.priceCents, 0);
}
