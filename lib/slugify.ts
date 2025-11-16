const base = (s: string) =>
    s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

export default async function slugify(
    title: string,
    exists: (slug: string) => Promise<boolean>
) {
    const b = base(title)
    let s = b
    let i = 1
    while (await exists(s)) {
    i += 1
    s = `${b}-${i}`
    }
    return s
}