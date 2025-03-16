import fs from 'fs'
import path from 'path'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import { matter } from 'vfile-matter'
import { remark } from 'remark';

type Metadata = {
  title: string
  slug: string
  date: string
  description: string
  tags: string[]
  originalUri?: string
}

async function parseFrontmatter(fileContent: string) {
  const file = await remark()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(() => (tree, file) => {
      matter(file)
    })
    .process(fileContent)

  const metadata = file.data.matter as Metadata
  const content = String(file)

  return { metadata, content }
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string) {
  const posts = fs.readdirSync(dir)
  
  const mdxFiles = posts.flatMap((post) => {
    return fs.readdirSync(path.join(dir, post)).map((file) => {
      return path.join(post, file)
    })
  })

  return mdxFiles.map(async (file: string) => {
    const { metadata, content } = await readMDXFile(path.join(dir, file))
    const slug = path.basename(file, path.extname(file))
    const locale = file.split('.')[0].split('/')[1]
    const folder = file.split('.')[0].split('/')[0]
    return {
      locale,
      metadata: metadata as Metadata,
      slug,
      //content,
      folder,
    }
  })
}

export async function getBlogPosts() {
  const postsPath = path.join(process.cwd(), 'src', 'content', 'blog')
  return await Promise.all(getMDXData(postsPath))
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}