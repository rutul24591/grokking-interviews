function adapt(legacy) {
  return { id: legacy.user_id, email: legacy.mail };
}
module.exports = { adapt };