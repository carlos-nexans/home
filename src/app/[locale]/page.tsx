import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import LatestPosts from "@/components/latest-posts";
import { getBlogPosts } from "@/content/utils";
import "./home.css";
import { getCanonicalUrl } from "@/i18n/utils";

export const dynamic = 'force-static'

export const revalidate = false;

export const generateMetadata = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const metadata = (await import(`@/content/home/${locale}.mdx`)).metadata;
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: getCanonicalUrl({ locale, pathname: "/" }),
      languages: {
        "en": getCanonicalUrl({ locale: "en", pathname: "/" }),
        "es": getCanonicalUrl({ locale: "es", pathname: "/" }),
      },
    },
  };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  const posts = await getBlogPosts();
  const latestPosts = posts.filter((post) => post.locale === locale)
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
    .slice(0, 5);

  try {
    const Content = (await import(`@/content/home/${locale}.mdx`)).default;
    return (
      <>
        <div className="home markdown-content">
          <Content />
        </div>
        <LatestPosts posts={latestPosts} />
      </>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
}
