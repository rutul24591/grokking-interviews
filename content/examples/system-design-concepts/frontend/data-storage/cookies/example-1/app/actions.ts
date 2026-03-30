"use server";

import { cookies } from "next/headers";

export async function saveCookiePreferences(formData: FormData) {
  const jar = await cookies();
  jar.set("theme", String(formData.get("theme") || "dark"), {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
    path: "/"
  });
  jar.set("viewerRole", String(formData.get("viewerRole") || "staff"), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/"
  });
}

