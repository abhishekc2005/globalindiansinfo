"use client";

import { useState, SyntheticEvent } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  fallbackClassName?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  className,
  fallbackClassName,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
  };

  if (error || !src) {
    if (fallbackSrc) {
      return <img src={fallbackSrc} alt={alt} className={className} />;
    }
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className,
          fallbackClassName
        )}
      >
        <ImageIcon className="w-10 h-10 opacity-50" />
      </div>
    );
  }

  // Handle standard HTML img tag if used without fill/width/height (legacy behavior support)
  // But Next.js Image requires width/height or fill.
  // If the user was using <img> tags before, we might want to support basic img behavior.
  // However, leveraging Next.js Image is better.
  // BUT: existing code uses <img> tags.
  // So let's make a version that wraps <img> if generic props are passed, OR uses next/image.
  // Actually, 'src' in <img> is string. 'src' in next/image can be object.
  // Let's stick to a simple <img> wrapper for now as the existing code uses <img>.

  return (
    <img
      src={src as string}
      alt={alt}
      className={className}
      onError={handleError}
      {...(props as any)}
    />
  );
}

export function ImageWithFallbackNext({
  src,
  alt,
  fallbackSrc,
  className,
  fallbackClassName,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground h-full w-full",
          className,
          fallbackClassName
        )}
      >
        <ImageIcon className="w-10 h-10 opacity-50" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}

export default ImageWithFallback;
