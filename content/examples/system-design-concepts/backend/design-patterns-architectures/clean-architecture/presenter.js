function present(user) {
  return { id: user.id, email: user.email };
}
module.exports = { present };