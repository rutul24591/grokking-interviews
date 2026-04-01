type ChecklistItem = { id: string; label: string; done: boolean };

type State = {
  title: string;
  slug: string;
  category: string;
  audience: string;
  checklist: ChecklistItem[];
  saveEnabled: boolean;
  lastMessage: string;
};

export const createState: State = {
  title: "",
  slug: "",
  category: "",
  audience: "",
  checklist: [],
  saveEnabled: false,
  lastMessage: "Authoring UIs should guide the first-save path instead of waiting for submission errors."
};

function recompute() {
  createState.checklist = [
    { id: "c1", label: "Title provided", done: createState.title.trim().length > 8 },
    { id: "c2", label: "Slug valid", done: /^[a-z0-9-]+$/.test(createState.slug) && createState.slug.length > 4 },
    { id: "c3", label: "Category selected", done: createState.category.length > 0 },
    { id: "c4", label: "Audience selected", done: createState.audience.length > 0 }
  ];
  createState.saveEnabled = createState.checklist.every((item) => item.done);
}

recompute();

export function snapshot() {
  return structuredClone(createState);
}

export function updateField(field: string, value: string) {
  if (field === "title") createState.title = value;
  if (field === "slug") createState.slug = value;
  if (field === "category") createState.category = value;
  if (field === "audience") createState.audience = value;
  recompute();
  createState.lastMessage = createState.saveEnabled
    ? "Draft is ready for bootstrap persistence and editor handoff."
    : "Title, slug, category, and audience must be valid before first save.";
  return snapshot();
}
