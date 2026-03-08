/**
 * Convert a string to a URL-friendly slug
 * @param value - The string to slugify
 * @returns A lowercase, hyphenated slug
 * @example slugify("Client-Side Rendering") // "client-side-rendering"
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Convert a slug back to a human-readable title
 * @param slug - The slug to convert
 * @returns A title-cased string
 * @example unslugify("client-side-rendering") // "Client Side Rendering"
 */
export function unslugify(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
