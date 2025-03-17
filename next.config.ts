import type { NextConfig } from "next";
import createNextIntl from "next-intl/plugin";
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import { getBlogPosts } from "@/content/utils";
import remarkMath from 'remark-math'

const withNextIntl = createNextIntl();
const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm, [remarkFrontmatter], remarkMath],
    rehypePlugins: [rehypeKatex, [rehypeHighlight, { lineOptions: { split: true } }]],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  rewrites: async () => {
    const posts = await getBlogPosts();
    const postRewrites = posts.flatMap((post) => [{
      source: `/es/${post.metadata.slug}`,
      destination: `/${post.locale}/blog/${post.folder}`,
    }, {
      source: `/en/${post.metadata.slug}`,
      destination: `/${post.locale}/blog/${post.folder}`,
    }]);

    return [...postRewrites];
  },
  redirects: async () => {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "meet.carlosnexans.com",
          },
        ],
        destination: "https://calendly.com/nexanscarlos/30min",
        permanent: false,
      },
    ];
  },
};

// Compose both withMDX and withNextIntl
export default withMDX(withNextIntl(nextConfig));