// Fallback to source if projection lag high
if (projectionLagMs > 500) await db.orders.find({ userId: '1' });
