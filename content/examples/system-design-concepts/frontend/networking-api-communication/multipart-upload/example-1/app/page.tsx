import MultipartUploader from "./multipart-uploader";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f0fdf4_0%,_#eff6ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Split large uploads into resumable parts</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app breaks article media into parts, uploads them independently to a Node origin, and completes the upload only after every part succeeds.
        </p>
        <MultipartUploader />
      </div>
    </main>
  );
}
