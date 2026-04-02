type Role = "admin" | "editor" | "viewer";
type Attrs = { orgId: string; classification: "public" | "internal" };

function rbac(role: Role, action: "read" | "edit" | "delete") {
  if (role === "admin") return true;
  if (role === "editor") return action !== "delete";
  return action === "read";
}

function abac(userOrg: string, doc: Attrs, action: string) {
  if (userOrg !== doc.orgId) return false;
  if (doc.classification === "internal" && action !== "read") return false;
  return true;
}

console.log(
  JSON.stringify(
    {
      example: {
        rbac: rbac("editor", "delete"),
        abac: abac("org1", { orgId: "org1", classification: "internal" }, "edit"),
        combined: rbac("editor", "edit") && abac("org1", { orgId: "org1", classification: "internal" }, "edit")
      }
    },
    null,
    2,
  ),
);

