export type Inventory = {
  buttons: Array<{ id: string; label?: string; ariaLabel?: string }>;
  images: Array<{ id: string; alt?: string }>;
  inputs: Array<{ id: string; label?: string }>;
};

export const INVENTORY: Inventory = {
  buttons: [
    { id: "save", label: "Save" },
    { id: "icon-only", ariaLabel: "Search" },
    { id: "bad-button" }
  ],
  images: [{ id: "logo", alt: "Company logo" }, { id: "bad-img" }],
  inputs: [{ id: "email", label: "Email" }, { id: "bad-input" }]
};

