import { getBlogPosts } from "@/content/utils";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string; folder: string }>;
}) => {
  const { locale, folder } = await params;
  const posts = await getBlogPosts();
  const post = posts.find(
    (post) => post.folder === folder && post.locale === locale
  );

  return {
    title: post?.metadata.title,
    description: post?.metadata.description,
    canonical: `/${post?.metadata.slug}`,
  };
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ locale: post.locale, folder: post.folder }));
}

const getContent = async (locale: string, folder: string) => {
  try {
    return (await import(`@/content/blog/${folder}/${locale}.mdx`)).default;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; folder: string }>;
}) {
  const { locale, folder } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  const Content = await getContent(locale, folder);

  if (Content) {
    return (
      <div className="markdown-content">
        <Content />
      </div>
    );
  }

  return notFound();
}
