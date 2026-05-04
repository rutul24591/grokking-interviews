export type SdkStatus = "notLoaded" | "loading" | "ready" | "error";
export type SdkState = { status: SdkStatus; error: string | null; version: string };

export function loadOnce(loader: () => Promise<void>) {
  let p: Promise<void> | null = null;
  return () => {
    if (!p) p = loader();
    return p;
  };
}
