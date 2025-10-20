export const slugify = (name: string) =>
  (name || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const makeProjectSlug = (title: string, id: string) => {
  const base = slugify(title || 'project')
  // include full uuid to avoid collisions and enable lookup by id in detail page
  return `${base}-${id}`
}
