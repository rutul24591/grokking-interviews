const { isEnabled } = require('./flag-service');
function handleCheckout(userId) {
  return isEnabled('newCheckout', userId) ? 'new' : 'old';
}
console.log(handleCheckout(42));