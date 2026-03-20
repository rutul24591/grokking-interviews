"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { likeArticle } from "@/lib/store";

const likeInput = z.object({ articleId: z.string().min(1).max(40) });

export async function likeAction(formData: FormData) {
  const parsed = likeInput.safeParse({
    articleId: String(formData.get("articleId") ?? ""),
  });
  if (!parsed.success) throw new Error("invalid input");

  likeArticle(parsed.data.articleId);
  revalidatePath("/");
}

