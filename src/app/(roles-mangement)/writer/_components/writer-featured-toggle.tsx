"use client";

import { Switch } from "@/components/ui/switch";
import { toggleFeaturedWriterAction } from "../_actions/writer.actions";
import { useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function WriterFeaturedToggle({
  articleId,
  isFeatured,
  className,
}: {
  articleId: string;
  isFeatured: boolean;
  className?: string; // Allow custom styling
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Switch
        checked={isFeatured}
        disabled={isPending}
        onCheckedChange={(checked) => {
          startTransition(async () => {
            try {
              await toggleFeaturedWriterAction(articleId, checked);
              toast.success(
                checked
                  ? "Post marked as featured"
                  : "Post removed from featured"
              );
            } catch (e) {
              toast.error("Failed to update featured status");
            }
          });
        }}
        id={`featured-toggle-${articleId}`}
      />
      <label
        htmlFor={`featured-toggle-${articleId}`}
        className="text-sm text-muted-foreground cursor-pointer select-none"
      >
        {isPending ? "Updating..." : isFeatured ? "Featured" : "Feature"}
      </label>
    </div>
  );
}
