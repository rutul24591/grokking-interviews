import { FileEditorClient } from "./file-editor";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">File System Access editor</h1>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <FileEditorClient />
      </div>
    </main>
  );
}

