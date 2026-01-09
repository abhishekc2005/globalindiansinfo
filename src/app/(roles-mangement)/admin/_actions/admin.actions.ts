"use server";

import { ArticleService } from "@/services/article.service";
import { MagazineService } from "@/services/magazine.service";
import { revalidatePath } from "next/cache";

export async function approveArticleAction(id: string) {
  await ArticleService.approveArticle(id);
  revalidatePath("/admin");
}

export async function rejectArticleAction(id: string) {
  await ArticleService.rejectArticle(id);
  revalidatePath("/admin");
}

export async function toggleFeaturedAction(id: string, isFeatured: boolean) {
  await ArticleService.updateArticle(id, { isFeatured });
  revalidatePath("/admin");
  revalidatePath("/admin/featured");
}

export async function approveMagazineAction(id: string) {
  await MagazineService.approveMagazine(id);
  revalidatePath("/admin");
}
