export type Tenant = { id: string; name: string; plan: string };

export type TenantContext = { activeTenantId: string; allowedTenantIds: Set<string> };

export function canSwitch(ctx: TenantContext, tenantId: string) {
  return ctx.allowedTenantIds.has(tenantId);
}
