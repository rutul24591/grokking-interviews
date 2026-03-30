"use client";

import { useEffect, useState } from "react";

type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function useInstallPrompt(): {
  canInstall: boolean;
  promptInstall: () => Promise<void>;
  lastOutcome: "accepted" | "dismissed" | null;
} {
  const [deferred, setDeferred] = useState<PromptEvent | null>(null);
  const [lastOutcome, setLastOutcome] = useState<"accepted" | "dismissed" | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as PromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  async function promptInstall() {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setLastOutcome(choice.outcome);
    setDeferred(null);
  }

  return { canInstall: deferred !== null, promptInstall, lastOutcome };
}

