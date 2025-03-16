import { getBlogPosts } from "@/content/utils";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string, folder: string }> }) => {
  const { locale, folder } = await params;
  const metadata = (await import(`@/content/blog/${folder}/${locale}.mdx`)).metadata;
  return {
    title: metadata.title,
    description: metadata.description,
    canonical: `/${metadata.slug}`,
  };
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ locale: post.locale, folder: post.folder }));
}

export default async function Page({ params }: { params: Promise<{ locale: string, folder: string }> }) {
  const { locale, folder } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  try {
    const Content = (await import(`@/content/blog/${folder}/${locale}.mdx`)).default;
    return (
      <div className="markdown-content">
        <Content />
      </div>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
}
