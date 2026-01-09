"use client";

import { Switch } from "@/components/ui/switch";
import { toggleFeaturedAction } from "../_actions/admin.actions";
import { useTransition } from "react";
import { toast } from "sonner";

export function FeaturedToggle({
  articleId,
  isFeatured,
}: {
  articleId: string;
  isFeatured: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isFeatured}
        disabled={isPending}
        onCheckedChange={(checked) => {
          startTransition(async () => {
            try {
              await toggleFeaturedAction(articleId, checked);
              toast.success(checked ? "Post featured" : "Post unfeatured");
            } catch (e) {
              toast.error("Failed to update featured status");
            }
          });
        }}
      />
      <span className="text-sm text-muted-foreground">
        {isFeatured ? "Featured" : "Standard"}
      </span>
    </div>
  );
}
