"use client";

import { forwardRef, useState } from "react";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import {
  useImageUploadPopover,
  UseImageUploadPopoverConfig,
} from "./use-image-upload-popover";
import { Button, ButtonProps } from "@/components/tiptap-ui-primitive/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/tiptap-ui-primitive/popover";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePlus, Link as LinkIcon, UploadCloud } from "lucide-react";
import { Label } from "@/components/ui/label";

// Reuse button primitives from LinkPopover or similar
export interface ImageUploadPopoverProps
  extends Omit<ButtonProps, "type">,
    UseImageUploadPopoverConfig {
  text?: string;
}

export const ImageUploadButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        type="button"
        className={className}
        data-style="ghost"
        role="button"
        tabIndex={-1}
        aria-label="Add Image"
        tooltip="Add Image"
        ref={ref}
        {...props}
      >
        {children || <ImagePlus className="tiptap-button-icon" />}
      </Button>
    );
  }
);
ImageUploadButton.displayName = "ImageUploadButton"; // Internal use

export const ImageUploadPopover = forwardRef<
  HTMLButtonElement,
  ImageUploadPopoverProps
>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      text,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = useState(false);

    const {
      isVisible,
      isActive,
      url,
      setUrl,
      handleUpload,
      handleUrlSubmit,
      isUploading,
    } = useImageUploadPopover({ editor, hideWhenUnavailable });

    if (!isVisible) return null;

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <ImageUploadButton
            data-active-state={isActive ? "on" : "off"}
            aria-pressed={isActive}
            {...buttonProps}
            ref={ref}
          >
            <ImagePlus className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
          </ImageUploadButton>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="w-full grid grid-cols-2 rounded-none border-b bg-muted/50 p-0">
              <TabsTrigger
                value="upload"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
              >
                Upload
              </TabsTrigger>
              <TabsTrigger
                value="url"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
              >
                Link
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <TabsContent value="upload" className="mt-0 space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors bg-muted/10 hover:bg-muted/20"
                  >
                    <UploadCloud className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Click to select image
                    </span>
                    <span className="text-xs text-muted-foreground/70 mt-1">
                      JGP, PNG, WebP up to 5MB
                    </span>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const success = await handleUpload(file);
                          if (success) setIsOpen(false);
                        }
                      }}
                      disabled={isUploading}
                    />
                  </Label>
                  {isUploading && (
                    <p className="text-xs text-center text-muted-foreground animate-pulse">
                      Uploading...
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="url" className="mt-0 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    placeholder="https://example.com/image.jpg"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleUrlSubmit();
                        setIsOpen(false);
                      }
                    }}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    handleUrlSubmit();
                    setIsOpen(false);
                  }}
                  disabled={!url}
                >
                  Insert Image
                </Button>
              </TabsContent>
            </div>
          </Tabs>
        </PopoverContent>
      </Popover>
    );
  }
);

ImageUploadPopover.displayName = "ImageUploadPopover";
