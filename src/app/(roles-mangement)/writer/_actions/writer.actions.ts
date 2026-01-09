"use server";

import { ArticleService } from "@/services/article.service";
import { revalidatePath } from "next/cache";

export async function toggleFeaturedWriterAction(
  id: string,
  isFeatured: boolean
) {
  // In a real app, we might want to verify the user owns the post here using auth()
  // But for now we assume the UI handles the visibility and the service handles basic updates.
  await ArticleService.updateArticle(id, { isFeatured });
  revalidatePath("/writer");
  revalidatePath("/writer/posts");
  revalidatePath("/writer/posts/featured");
}
