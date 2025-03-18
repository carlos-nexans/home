import { getBlogPosts } from "@/content/utils";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { baseUrl } from "@/app/sitemap";
import { getCanonicalUrl } from "@/i18n/utils";

export const dynamic = 'force-static'

export const revalidate = false;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string; folder: string }>;
}): Promise<Metadata> => {
  const { locale, folder } = await params;
  const posts = await getBlogPosts();
  const post = posts.find(
    (post) => post.folder === folder && post.locale === locale
  );

  const otherLocales = posts.filter(
    (post) => post.folder === folder && post.locale !== locale
  );

  const alternates = otherLocales.reduce((acc, post) => {
    acc[post.metadata.slug] = getCanonicalUrl({ locale: post.locale, pathname: `/${post.metadata.slug}` });
    return acc;
  }, {} as Record<string, string>);

  const canonical = getCanonicalUrl({ locale, pathname: `/${post?.metadata.slug}` });

  return {
    title: post?.metadata.title,
    description: post?.metadata.description,
    authors: [{ name: "Carlos Nexans" }],
    creator: "Carlos Nexans",
    publisher: "Carlos Nexans",
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonical,
      languages: alternates,
    },
    openGraph: {
      title: post?.metadata.title,
      description: post?.metadata.description,
      type: 'article',
      publishedTime: post?.metadata.date,
      url: canonical,
      images: [
        {
          url: `${baseUrl}/og?title=${post?.metadata.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post?.metadata.title,
      description: post?.metadata.description,
      images: [`${baseUrl}/og?title=${post?.metadata.title}`],
    },
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
