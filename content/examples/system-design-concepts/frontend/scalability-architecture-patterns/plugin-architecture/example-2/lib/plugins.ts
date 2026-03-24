import type { Plugin } from "@/lib/contracts";

export const ReaderPlugin: Plugin = {
  manifest: { id: "reader", version: "1.0.0", label: "Reader", capabilities: ["read-content"] },
  run: (api) => {
    const c = api.readContent();
    return { ok: true, message: `Read title: ${c.title}` };
  }
};

export const PublisherPlugin: Plugin = {
  manifest: { id: "publisher", version: "1.0.0", label: "Publisher", capabilities: ["publish"] },
  run: (api) => {
    api.publish();
    return { ok: true, message: "Publish requested." };
  }
};

