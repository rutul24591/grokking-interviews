const { can } = require('./policy');
function authorize(role, permission) {
  if (!can(role, permission)) throw new Error('forbidden');
  return true;
}
module.exports = { authorize };