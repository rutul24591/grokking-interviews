export type Version = {
  id: string;
  label: string;
  status: "draft" | "published" | "archived";
  editor: string;
  summary: string;
};

type State = {
  activeId: string;
  versions: Version[];
  releaseWindow: string;
  lastMessage: string;
};

export const versionState: State = {
  activeId: "v3",
  releaseWindow: "Tue 18:30 UTC",
  versions: [
    { id: "v1", label: "Revision 12", status: "archived", editor: "Anika", summary: "Previous published version kept for rollback." },
    { id: "v2", label: "Revision 13", status: "draft", editor: "Marco", summary: "Adds CDN invalidation guidance and retention notes." },
    { id: "v3", label: "Revision 14", status: "published", editor: "Nina", summary: "Current live revision with editorial and compliance approval." }
  ],
  lastMessage: "Production versioning needs rollback safety, authorship traceability, and clear publish intent."
};

export function snapshot() {
  return structuredClone(versionState);
}

export function applyAction(type: "restore" | "publish", versionId: string) {
  const version = versionState.versions.find((item) => item.id === versionId);
  if (!version) {
    return snapshot();
  }

  if (type === "restore") {
    versionState.activeId = versionId;
    versionState.lastMessage = `Restored ${version.label} into the working slot for review.`;
    return snapshot();
  }

  versionState.versions = versionState.versions.map((item) => ({
    ...item,
    status: item.id === versionId ? "published" : item.status === "published" ? "archived" : item.status
  }));
  versionState.activeId = versionId;
  versionState.lastMessage = `${version.label} is now the published revision and previous live content moved to archived.`;
  return snapshot();
}
