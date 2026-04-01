export type Role = "viewer" | "editor" | "reviewer" | "admin";
export type Resource = "draft" | "published" | "billing-report";
export type Action = "view" | "edit" | "publish" | "delete";

export const policyMatrix: Record<Resource, Record<Action, Partial<Record<Role, { allowed: boolean; reason: string }>>>> = {
  draft: {
    view: {
      viewer: { allowed: true, reason: "Viewers may read drafts assigned to them." },
      editor: { allowed: true, reason: "Editors may inspect drafts they will edit." },
      reviewer: { allowed: true, reason: "Reviewers need read access before publishing decisions." },
      admin: { allowed: true, reason: "Admins have full visibility." },
    },
    edit: {
      viewer: { allowed: false, reason: "Viewers cannot modify authoring state." },
      editor: { allowed: true, reason: "Editors own draft edits." },
      reviewer: { allowed: false, reason: "Reviewers should not mutate draft content directly." },
      admin: { allowed: true, reason: "Admins may intervene on draft quality issues." },
    },
    publish: {
      viewer: { allowed: false, reason: "Publishing requires elevated workflow rights." },
      editor: { allowed: false, reason: "Editors can prepare but not publish." },
      reviewer: { allowed: true, reason: "Reviewers approve publication." },
      admin: { allowed: true, reason: "Admins can override workflow bottlenecks." },
    },
    delete: {
      admin: { allowed: true, reason: "Only admins may hard delete drafts." },
    },
  },
  published: {
    view: {
      viewer: { allowed: true, reason: "Published content is broadly visible." },
      editor: { allowed: true, reason: "Editors retain read access post-publish." },
      reviewer: { allowed: true, reason: "Reviewers audit published output." },
      admin: { allowed: true, reason: "Admins monitor production state." },
    },
    edit: {
      viewer: { allowed: false, reason: "Viewers cannot change published content." },
      editor: { allowed: true, reason: "Editors can prepare revisions." },
      reviewer: { allowed: false, reason: "Reviewers sign off but do not rewrite published content." },
      admin: { allowed: true, reason: "Admins may patch critical issues." },
    },
    publish: {
      reviewer: { allowed: true, reason: "Reviewers may republish approved revisions." },
      admin: { allowed: true, reason: "Admins may force republish." },
    },
    delete: {
      admin: { allowed: true, reason: "Deletion of published content is highly restricted." },
    },
  },
  "billing-report": {
    view: {
      reviewer: { allowed: false, reason: "Reviewers are outside finance access boundaries." },
      admin: { allowed: true, reason: "Admins may inspect regulated reporting data." },
    },
    edit: {
      admin: { allowed: false, reason: "Billing reports are append-only and not directly editable." },
    },
    publish: {
      admin: { allowed: false, reason: "Publishing is handled by the finance pipeline, not the CMS." },
    },
    delete: {
      admin: { allowed: false, reason: "Retention policy forbids deleting billing reports." },
    },
  },
};

export function evaluatePolicy(role: Role, resource: Resource, action: Action) {
  const decision = policyMatrix[resource]?.[action]?.[role];
  if (decision) return { ...decision, role, resource, action };
  return {
    allowed: false,
    role,
    resource,
    action,
    reason: "No explicit allow rule exists. Deny by default.",
  };
}
