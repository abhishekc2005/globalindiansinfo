"use client";

import { useCallback, useState } from "react";
import type { Editor } from "@tiptap/react";
import { handleImageUpload } from "@/lib/tiptap-utils";
import { toast } from "sonner";

export const IMAGE_UPLOAD_SHORTCUT_KEY = "mod+shift+i";

export interface UseImageUploadPopoverConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
}

export function useImageUploadPopover(config?: UseImageUploadPopoverConfig) {
  const { editor, hideWhenUnavailable = false } = config || {};
  const [url, setUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const canInsert =
    editor?.isEditable &&
    editor?.can().insertContent({ type: "image", attrs: { src: "" } });
  const isActive = editor?.isActive("image");
  const isVisible = !hideWhenUnavailable || canInsert;

  const handleUpload = useCallback(
    async (file: File) => {
      if (!editor) return;

      try {
        setIsUploading(true);
        // Use the updated utility which calls the API
        const uploadedUrl = await handleImageUpload(file);

        editor.chain().focus().setImage({ src: uploadedUrl }).run();
        toast.success("Image uploaded successfully");
        return true;
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload image");
        return false;
      } finally {
        setIsUploading(false);
      }
    },
    [editor]
  );

  const handleUrlSubmit = useCallback(() => {
    if (!editor || !url) return;
    editor.chain().focus().setImage({ src: url }).run();
    setUrl(""); // Reset
  }, [editor, url]);

  return {
    isVisible,
    isActive,
    canInsert,
    url,
    setUrl,
    handleUpload,
    handleUrlSubmit,
    isUploading,
    label: "Add Image",
  };
}
