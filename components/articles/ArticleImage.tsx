"use client";

import Image from "next/image";
import { useState } from "react";

type ArticleImageProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

// Cache busting version - increment this when images are updated
const IMAGE_CACHE_VERSION = "v2";

export function ArticleImage({
  src,
  alt,
  caption,
  width = 900,
  height = 500,
  priority = false,
}: ArticleImageProps) {
  const [error, setError] = useState(false);
  const isSvg = src.endsWith(".svg");
  
  // Add cache-busting query parameter only for SVGs (Next.js Image doesn't support query params)
  const imageSrc = isSvg ? `${src}?${IMAGE_CACHE_VERSION}` : src;

  if (error) {
    return (
      <figure className="my-8">
        <div className="flex justify-center rounded-lg border border-theme bg-panel p-8">
          <div className="text-center text-muted">
            <p className="text-sm">Image failed to load</p>
            <p className="text-xs mt-1 font-mono">{src}</p>
            <p className="text-xs mt-2 text-accent">Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)</p>
          </div>
        </div>
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-muted">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className="my-8">
      <div className="flex justify-center rounded-lg border border-theme bg-panel p-4 overflow-x-auto">
        {isSvg ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageSrc}
            alt={alt}
            className="rounded max-w-full h-auto block"
            loading={priority ? "eager" : "lazy"}
            onError={() => setError(true)}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="rounded max-w-full h-auto"
            unoptimized={src.startsWith("http")}
            priority={priority}
            onError={() => setError(true)}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
