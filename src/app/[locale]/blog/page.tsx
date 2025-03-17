import PostList from "@/components/post-lists";
import { getBlogPosts } from "@/content/utils";
import { routing } from "@/i18n/routing";

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
      canonical: "/",
      languages: {
        es: "/es/blog",
        en: "/en/blog",
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
  const posts = (await getBlogPosts()).filter((post) => post.locale === locale);
  return (
    <div>
      <h1 className="text-[32px] font-bold my-4">Artículos</h1>
      <div className="flex flex-col space-y-4">
        <PostList posts={posts} />
      </div>
    </div>
  );
}
