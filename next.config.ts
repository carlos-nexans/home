import { getBlogPosts } from "@/content/utils";
import createMDX from '@next/mdx';
import type { NextConfig } from "next";
import createNextIntl from "next-intl/plugin";
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

async function generateRedirects() {
  const posts = await getBlogPosts();
  const prefixes = ['articles', 'articulos', 'tutoriales', 'tutorials'];
  
  const redirects = posts.flatMap(post => {
    return prefixes.map(prefix => ({
      source: `/${prefix}/${post.metadata.slug}`,
      destination: `/${post.metadata.slug}`,
      permanent: true
    }));
  });

  return redirects;
}

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
    const oldWebsiteRedirects = await generateRedirects();
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
      ...oldWebsiteRedirects,
    ];
  },
};

// Compose both withMDX and withNextIntl
export default withMDX(withNextIntl(nextConfig));