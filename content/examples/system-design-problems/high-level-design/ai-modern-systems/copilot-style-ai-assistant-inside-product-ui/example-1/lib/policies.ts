const ACTIONS_BY_ROLE = {
  viewer: ['summarize'],
  seller: ['summarize', 'draft_follow_up', 'create_task'],
  manager: ['summarize', 'draft_follow_up', 'create_task', 'update_stage', 'reassign_owner'],
};

const FIELD_ALLOWLIST_BY_ROLE = {
  viewer: ['id', 'name', 'stage', 'owner', 'lastActivity'],
  seller: ['id', 'name', 'stage', 'amount', 'owner', 'lastActivity'],
  manager: ['id', 'name', 'stage', 'amount', 'owner', 'contactEmail', 'internalRiskScore', 'lastActivity'],
};

const SENSITIVE_FIELDS = new Set(['contactEmail', 'phone', 'ssn', 'paymentToken']);

function listAvailableActions(role) {
  return ACTIONS_BY_ROLE[role] ?? ACTIONS_BY_ROLE.viewer;
}

function amountBand(amount) {
  if (amount >= 1_000_000) return `over $${Math.floor(amount / 1_000_000)}M`;
  if (amount >= 100_000) return `about $${Math.round(amount / 1000)}K`;
  return 'under $100K';
}

function redactSensitiveFields(record) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      key,
      SENSITIVE_FIELDS.has(key) ? '[redacted]' : value,
    ]),
  );
}

function assembleCopilotContext({ entityType, entity, role, query }) {
  const allowedFields = FIELD_ALLOWLIST_BY_ROLE[role] ?? FIELD_ALLOWLIST_BY_ROLE.viewer;
  const currentEntity = {};
  const policyTrace = [`role:${role}`, `entity:${entityType}`];

  for (const field of allowedFields) {
    if (!(field in entity)) continue;
    if (SENSITIVE_FIELDS.has(field)) {
      policyTrace.push(`masked:${field}`);
      continue;
    }
    if (field === 'amount') {
      currentEntity.amountBand = amountBand(entity[field]);
    } else {
      currentEntity[field] = entity[field];
    }
  }

  for (const field of Object.keys(entity)) {
    if (!allowedFields.includes(field)) policyTrace.push(`excluded:${field}`);
  }

  return {
    currentEntity,
    userContext: { role },
    userQuery: query,
    availableActions: listAvailableActions(role),
    policyTrace,
  };
}

module.exports = {
  assembleCopilotContext,
  listAvailableActions,
  redactSensitiveFields,
};
