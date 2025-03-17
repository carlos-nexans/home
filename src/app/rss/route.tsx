import { baseUrl } from '@/app/sitemap'
import { getBlogPosts } from '@/content/utils'
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('lang') || 'en';
  const allBlogs = (await getBlogPosts()).filter((post) => post.locale === locale)
  const itemsXml = allBlogs
    .sort((a, b) => {
      if (new Date(a.metadata.date) > new Date(b.metadata.date)) {
        return -1
      }
      return 1
    })
    .map(
      (post) =>
        `<item>
          <title>${post.metadata.title}</title>
          <link>${baseUrl}/${post.metadata.slug}</link>
          <description>${post.metadata.description || ''}</description>
          <pubDate>${new Date(
            post.metadata.date
          ).toUTCString()}</pubDate>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>Carlos Nexans</title>
        <link>${baseUrl}</link>
        <description>Carlos Nexans's website</description>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}