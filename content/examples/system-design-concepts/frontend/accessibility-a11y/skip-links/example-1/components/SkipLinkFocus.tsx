"use client";

import { useEffect } from "react";

function focusHashTarget() {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return;
  const id = decodeURIComponent(hash.slice(1));
  const el = document.getElementById(id);
  if (!el) return;
  if (typeof (el as HTMLElement).focus === "function") (el as HTMLElement).focus();
}

export function SkipLinkFocus() {
  useEffect(() => {
    // Handle initial load with hash.
    focusHashTarget();
    // Handle subsequent hash navigations.
    const onChange = () => focusHashTarget();
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return null;
}

