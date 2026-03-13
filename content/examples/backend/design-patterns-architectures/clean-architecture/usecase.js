function createUser(data) {
  return { id: 'u1', email: data.email };
}
module.exports = { createUser };