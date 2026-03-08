"use client";

import Image from "next/image";

type ArticleImageProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export function ArticleImage({
  src,
  alt,
  caption,
  width = 900,
  height = 500,
}: ArticleImageProps) {
  return (
    <figure className="my-8">
      <div className="flex justify-center rounded-lg border border-theme bg-panel p-4 overflow-x-auto">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="rounded max-w-full h-auto"
          unoptimized={src.startsWith("http")}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
