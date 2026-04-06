/**
 * Pasted Content Sanitizer: Strip Formatting, Convert to Internal Format,
 * Image Extraction
 *
 * EDGE CASE: When users paste content from Word, Google Docs, or web pages,
 * the clipboard contains a soup of HTML: inline styles, font tags, class
 * names, script tags, and potentially malicious content. Additionally, images
 * in the pasted content may reference local file paths (file://) or blob URLs
 * that won't resolve in our application.
 *
 * REQUIREMENTS:
 * 1. Strip all formatting, keep only semantic HTML (b, i, u, a, ul, ol, p, br)
 * 2. Convert to the editor's internal format (e.g., delta operations or AST)
 * 3. Extract images from pasted content and upload them to our CDN
 * 4. Block dangerous content (script tags, event handlers, javascript: URLs)
 * 5. Preserve plain text when pasting as "paste as text" mode
 *
 * INTERVIEW FOLLOW-UP: "How do you handle images pasted from clipboard?"
 * "What sanitization do you apply to pasted HTML?"
 * "How do you convert pasted HTML to your editor's internal format?"
 */

import { useCallback, useRef } from "react";

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

interface SanitizedContent {
  /** Clean HTML with only allowed tags and attributes */
  html: string;
  /** Plain text extracted from the content */
  text: string;
  /** Extracted images that need uploading */
  images: ExtractedImage[];
  /** Whether the content was modified (sanitized) */
  wasSanitized: boolean;
}

interface ExtractedImage {
  /** Original src URL of the image */
  src: string;
  /** Alt text if available */
  alt: string;
  /** Whether the image is a local file path (needs special handling) */
  isLocalFile: boolean;
  /** Whether the image is a blob URL (needs upload before page unload) */
  isBlobUrl: boolean;
  /** Blob data if the image was pasted directly from clipboard */
  blob?: Blob;
}

interface SanitizerOptions {
  /** Allowed HTML tags (whitelist approach) */
  allowedTags?: string[];
  /** Allowed HTML attributes on any tag */
  allowedAttrs?: string[];
  /** Allowed attributes on specific tags (e.g., href on <a>) */
  allowedTagAttrs?: Record<string, string[]>;
  /** Maximum number of images to extract from pasted content */
  maxImages?: number;
  /** Whether to convert <div> and <br> to <p> tags */
  normalizeParagraphs?: boolean;
  /** Callback for each extracted image */
  onImageExtracted?: (image: ExtractedImage) => Promise<string | null>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default allowed tags — semantic HTML only, no presentational tags */
const DEFAULT_ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "a",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "blockquote",
  "code",
  "pre",
  "span",
];

/** Attributes allowed on any tag */
const DEFAULT_ALLOWED_ATTRS = [];

/** Tag-specific allowed attributes */
const DEFAULT_TAG_ATTRS: Record<string, string[]> = {
  a: ["href", "title", "rel"],
  img: ["src", "alt", "title"],
  code: ["class"], // For language highlighting classes
  pre: ["class"],
};

/** Dangerous URL protocols to block */
const DANGEROUS_PROTOCOLS = [
  "javascript:",
  "vbscript:",
  "data:",
  "blob:",
];

// ---------------------------------------------------------------------------
// Sanitization Functions
// ---------------------------------------------------------------------------

/**
 * Checks if a URL uses a dangerous protocol.
 */
function isSafeUrl(url: string): boolean {
  const lowerUrl = url.trim().toLowerCase();
  return !DANGEROUS_PROTOCOLS.some((protocol) =>
    lowerUrl.startsWith(protocol)
  );
}

/**
 * Checks if an image source is a local file path.
 */
function isLocalFilePath(src: string): boolean {
  return (
    src.startsWith("file://") ||
    src.startsWith("/") === false && src.includes("://") === false
  );
}

/**
 * Checks if a URL is a blob URL.
 */
function isBlobUrl(src: string): boolean {
  return src.startsWith("blob:");
}

/**
 * Sanitizes an HTML string by stripping disallowed tags and attributes.
 *
 * Uses DOMParser to parse the HTML into a document, then walks the DOM tree
 * removing anything not in the whitelist. This is safer than regex-based
 * sanitization because it works with the browser's actual HTML parser.
 */
function sanitizeHtml(
  html: string,
  options: Required<Pick<SanitizerOptions, "allowedTags" | "allowedAttrs" | "allowedTagAttrs">>
): { sanitizedHtml: string; extractedImages: ExtractedImage[] } {
  // Parse HTML into a DOM document
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    `<div>${html}</div>`,
    "text/html"
  );
  const container = doc.body.firstElementChild;

  if (!container) {
    return { sanitizedHtml: "", extractedImages: [] };
  }

  const extractedImages: ExtractedImage[] = [];

  /**
   * Recursively walk the DOM tree, removing disallowed elements and attributes.
   *
   * Strategy:
   * - If a tag is not allowed, unwrap it (keep its children)
   * - If a tag is allowed, strip its disallowed attributes
   * - Special handling for <a> href and <img> src
   */
  function walkAndClean(node: Node): void {
    const children = Array.from(node.childNodes);

    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as Element;
        const tagName = element.tagName.toLowerCase();

        if (!options.allowedTags.includes(tagName)) {
          // Tag not allowed — unwrap (replace with children)
          const grandParent = element.parentNode!;
          while (element.firstChild) {
            grandParent.insertBefore(element.firstChild, element);
          }
          grandParent.removeChild(element);
          // Continue walking the moved children
          walkAndClean(grandParent);
        } else {
          // Tag allowed — strip disallowed attributes
          const allowedAttrs = [
            ...options.allowedAttrs,
            ...(options.allowedTagAttrs[tagName] ?? []),
          ];

          Array.from(element.attributes).forEach((attr) => {
            if (!allowedAttrs.includes(attr.name)) {
              element.removeAttribute(attr.name);
            }

            // Special validation for href and src
            if (attr.name === "href" && tagName === "a") {
              if (!isSafeUrl(attr.value)) {
                element.removeAttribute("href");
                element.setAttribute("rel", "noopener noreferrer");
              }
            }

            if (attr.name === "src" && tagName === "img") {
              if (!isSafeUrl(attr.value)) {
                element.removeAttribute("src");
              } else {
                // Track image for potential extraction/upload
                const src = attr.value;
                const alt = element.getAttribute("alt") ?? "";

                extractedImages.push({
                  src,
                  alt,
                  isLocalFile: isLocalFilePath(src),
                  isBlobUrl: isBlobUrl(src),
                });
              }
            }
          });

          // Walk children
          walkAndClean(element);
        }
      } else if (child.nodeType === Node.SCRIPT_NODE) {
        // Remove script nodes immediately
        child.parentNode?.removeChild(child);
      }
    }
  }

  walkAndClean(container);

  // Remove event handlers (on*) that might have been in text nodes
  // (Edge case: malformed HTML where attributes leaked into text)
  const sanitizedHtml = container.innerHTML;

  return { sanitizedHtml, extractedImages };
}

/**
 * Converts sanitized HTML to plain text by extracting textContent.
 * Preserves paragraph breaks as double newlines.
 */
function htmlToPlainText(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Replace <br> and block-level endings with newlines
  doc.querySelectorAll("br").forEach((br) => {
    br.replaceWith("\n");
  });

  doc.querySelectorAll("p, div, h1, h2, h3, li, blockquote").forEach(
    (block) => {
      if (block.textContent) {
        block.textContent = block.textContent + "\n\n";
      }
    }
  );

  return doc.body.textContent?.replace(/\n{3,}/g, "\n\n").trim() ?? "";
}

// ---------------------------------------------------------------------------
// React Hook
// ---------------------------------------------------------------------------

interface UsePasteSanitizerOptions extends SanitizerOptions {
  /** Whether to sanitize by default (can be toggled off with Shift+paste) */
  sanitizeByDefault?: boolean;
}

interface UsePasteSanitizerReturn {
  /**
   * Handle paste event. Sanitizes clipboard content and returns
   * SanitizedContent with clean HTML, text, and extracted images.
   */
  handlePaste: (
    event: React.ClipboardEvent<HTMLElement>
  ) => Promise<SanitizedContent | null>;
  /** Whether the sanitizer is currently active */
  isActive: boolean;
  /** Toggle sanitizer on/off */
  toggle: () => void;
  /** Reset to default state */
  reset: () => void;
}

/**
 * Hook that provides paste sanitization for rich text editors.
 *
 * Usage:
 *   const { handlePaste } = usePasteSanitizer({
 *     onImageExtracted: async (image) => {
 *       const url = await uploadImage(image.blob!);
 *       return url;
 *     },
 *   });
 *
 *   <div contentEditable onPaste={handlePaste} />
 */
export function usePasteSanitizer(
  options: UsePasteSanitizerOptions = {}
): UsePasteSanitizerReturn {
  const {
    allowedTags = DEFAULT_ALLOWED_TAGS,
    allowedAttrs = DEFAULT_ALLOWED_ATTRS,
    allowedTagAttrs = DEFAULT_TAG_ATTRS,
    maxImages = 10,
    normalizeParagraphs = true,
    onImageExtracted,
    sanitizeByDefault = true,
  } = options;

  const isActiveRef = useRef(sanitizeByDefault);

  const handlePaste = useCallback(
    async (
      event: React.ClipboardEvent<HTMLElement>
    ): Promise<SanitizedContent | null> => {
      if (!isActiveRef.current) {
        // Don't sanitize — let the browser handle the paste natively
        return null;
      }

      // Prevent default paste behavior
      event.preventDefault();

      const clipboardData = event.clipboardData;
      if (!clipboardData) return null;

      // Try to get HTML first, fall back to plain text
      const htmlData = clipboardData.getData("text/html");
      const textData = clipboardData.getData("text/plain");

      // Handle image files pasted directly (e.g., screenshot from clipboard)
      const files = Array.from(clipboardData.files);
      const imageFiles: ExtractedImage[] = files
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, maxImages)
        .map((f) => ({
          src: URL.createObjectURL(f),
          alt: f.name.replace(/\.[^.]+$/, ""),
          isLocalFile: false,
          isBlobUrl: true,
          blob: f,
        }));

      let result: SanitizedContent;

      if (htmlData) {
        // Sanitize the HTML
        const { sanitizedHtml, extractedImages } = sanitizeHtml(htmlData, {
          allowedTags,
          allowedAttrs,
          allowedTagAttrs,
        });

        // Merge extracted images from HTML with directly-pasted image files
        const allImages = [
          ...extractedImages.slice(0, maxImages),
          ...imageFiles.slice(0, Math.max(0, maxImages - extractedImages.length)),
        ];

        result = {
          html: sanitizedHtml,
          text: htmlToPlainText(sanitizedHtml),
          images: allImages,
          wasSanitized: true,
        };
      } else if (textData) {
        // Plain text paste — wrap in <p> tags for consistency
        result = {
          html: `<p>${textData
            .split("\n\n")
            .map((p) => p.replace(/\n/g, "<br>"))
            .join("</p><p>")}</p>`,
          text: textData,
          images: imageFiles,
          wasSanitized: false,
        };
      } else {
        // Nothing in clipboard
        return null;
      }

      // Upload extracted images if callback provided
      if (onImageExtracted && result.images.length > 0) {
        for (const image of result.images) {
          if (image.blob) {
            const uploadedUrl = await onImageExtracted(image);
            if (uploadedUrl) {
              // Replace the blob URL in the HTML with the uploaded URL
              result.html = result.html.replace(image.src, uploadedUrl);
            }
          }
        }
      }

      return result;
    },
    [allowedTags, allowedAttrs, allowedTagAttrs, maxImages, onImageExtracted]
  );

  const toggle = useCallback(() => {
    isActiveRef.current = !isActiveRef.current;
  }, []);

  const reset = useCallback(() => {
    isActiveRef.current = sanitizeByDefault;
  }, [sanitizeByDefault]);

  return {
    handlePaste,
    isActive: isActiveRef.current,
    toggle,
    reset,
  };
}
