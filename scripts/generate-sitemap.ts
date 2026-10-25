// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"

const BASE_URL = "https://her-frequency.lovable.app"

interface SitemapEntry {
  path: string
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: string
}

// Public, indexable routes. Hidden-for-launch pages (/services, /shop, /blog),
// admin routes and the not-found route are intentionally omitted.
const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/events", changefreq: "weekly", priority: "0.9" },
  { path: "/gallery", changefreq: "weekly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/testimonials", changefreq: "weekly", priority: "0.7" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/booking", changefreq: "monthly", priority: "0.6" },
]

// One entry per event, read live from the shared events list so new events
// are picked up automatically on the next dev run or build.
const eventsSource = readFileSync(resolve("src/data/events.ts"), "utf8")
const eventIds = [...eventsSource.matchAll(/\bid:\s*(\d+)\b/g)].map((m) => m[1])
for (const id of eventIds) {
  entries.push({ path: `/events/${id}`, changefreq: "weekly", priority: "0.8" })
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  )

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n")
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries))
console.log(`sitemap.xml written (${entries.length} entries)`)
