const PERMS = {
  ARTICLE_READ: 1 << 0,
  ARTICLE_PUBLISH: 1 << 1,
  ADMIN_USERS_READ: 1 << 2
};

const ROLES = {
  reader: PERMS.ARTICLE_READ,
  editor: PERMS.ARTICLE_READ | PERMS.ARTICLE_PUBLISH,
  admin: PERMS.ARTICLE_READ | PERMS.ARTICLE_PUBLISH | PERMS.ADMIN_USERS_READ
};

function can(roleMask, permMask) {
  return (roleMask & permMask) === permMask;
}

for (const [role, mask] of Object.entries(ROLES)) {
  process.stdout.write(
    `${role} can publish? ${can(mask, PERMS.ARTICLE_PUBLISH)} can admin? ${can(mask, PERMS.ADMIN_USERS_READ)}\n`
  );
}

