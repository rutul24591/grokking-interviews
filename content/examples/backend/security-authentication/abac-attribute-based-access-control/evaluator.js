function allow(user, resource) {
  return user.department === resource.department;
}

module.exports = { allow };