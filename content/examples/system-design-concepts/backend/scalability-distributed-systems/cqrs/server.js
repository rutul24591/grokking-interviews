// Command handler
await db.orders.insert(order);
await eventBus.publish({ type: 'OrderCreated', orderId: order.id });

// Read model projector
eventBus.on('OrderCreated', async (evt) => {
  await readDb.order_view.insert({ id: evt.orderId, status: 'created' });
});
