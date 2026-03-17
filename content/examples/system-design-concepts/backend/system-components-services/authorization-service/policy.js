const roles = { admin: ['read:any', 'write:any'], user: ['read:own'] };
function can(role, permission) {
  return (roles[role] || []).includes(permission);
}
module.exports = { can };