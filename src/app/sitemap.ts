import { getBlogPosts } from '@/content/utils'

export const baseUrl = process.env.VERCEL_ENV === "production" ? 
  process.env.VERCEL_URL  :
  process.env.VERCEL_URL || 'http://localhost:3000'

export default async function sitemap() {
  const posts = await getBlogPosts()
  
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.metadata.slug}`,
    lastModified: post.metadata.date,
  }))

  const routes = ['', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...postUrls]
}