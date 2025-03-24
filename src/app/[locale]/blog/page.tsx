import PostList from "@/components/post-lists";
import { getBlogPosts } from "@/content/utils";
import { routing } from "@/i18n/routing";
import { getCanonicalUrl } from "@/i18n/utils";
import { setRequestLocale } from "next-intl/server";

export const dynamic = 'force-static'

export const revalidate = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const metadata = {
  es: {
    title: "Blog",
    description: "Blog",
  },
  en: {
    title: "Blog",
    description: "Blog",
  },
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  return {
    alternates: {
      canonical: getCanonicalUrl({ locale, pathname: "/blog" }),
      languages: {
        es: getCanonicalUrl({ locale: "es", pathname: "/blog" }),
        en: getCanonicalUrl({ locale: "en", pathname: "/blog" }),
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    ...metadata[locale as keyof typeof metadata],
  };
};

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);
  const posts = (await getBlogPosts()).filter((post) => post.locale === locale);
  return (
    <div>
      <h1 className="text-4xl font-bold my-4">Artículos</h1>
      <div className="flex flex-col space-y-4">
        <PostList posts={posts} />
      </div>
    </div>
  );
}
