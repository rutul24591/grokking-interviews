async function createOrderSaga(order) {
  const orderId = await createOrder(order);
  try {
    await reserveInventory(orderId);
    await chargePayment(orderId);
    await confirmOrder(orderId);
  } catch (err) {
    await cancelPayment(orderId);
    await releaseInventory(orderId);
    await failOrder(orderId);
    throw err;
  }
}
