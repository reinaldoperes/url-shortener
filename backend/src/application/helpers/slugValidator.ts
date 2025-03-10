export function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9-_]+$/.test(slug);
}
