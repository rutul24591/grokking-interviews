"use client";

import Image from "next/image";

type ArticleImageProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  // Mirrors next/image API. For SVG we map this to eager loading.
  priority?: boolean;
};

export function ArticleImage({
  src,
  alt,
  caption,
  width = 900,
  height = 500,
  priority = false,
}: ArticleImageProps) {
  const isSvg = src.endsWith(".svg");

  return (
    <figure className="my-8">
      <div className="flex justify-center rounded-lg border border-theme bg-panel p-4 overflow-x-auto">
        {isSvg ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={alt}
            className="rounded max-w-full h-auto block"
            loading={priority ? "eager" : "lazy"}
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
