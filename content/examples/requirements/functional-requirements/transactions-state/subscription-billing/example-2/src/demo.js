function chooseRenewalPath(subscriptions) {
  return subscriptions.map((subscription) => ({
    id: subscription.id,
    billNow: subscription.active && !subscription.paymentMethodExpired,
    enterDunning: subscription.paymentMethodExpired || subscription.failedCharge,
    suppressRenewal: subscription.cancelAtPeriodEnd
  }));
}

console.log(chooseRenewalPath([
  { id: "sub-1", active: true, paymentMethodExpired: false, failedCharge: false, cancelAtPeriodEnd: false },
  { id: "sub-2", active: true, paymentMethodExpired: true, failedCharge: true, cancelAtPeriodEnd: false }
]));
