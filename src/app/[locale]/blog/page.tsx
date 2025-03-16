import { getBlogPosts } from "@/content/utils";
import { routing } from "@/i18n/routing";
import Link from "next/link";

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
  return metadata[locale as keyof typeof metadata];
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = (await getBlogPosts()).filter((post) => post.locale === locale);
  return (
    <div>
      <h1 className="text-[32px] font-bold">Artículos</h1>
      <div className="flex flex-col space-y-2"></div>
      {posts.map((post) => (
        <div className="flex flex-col" key={post.slug}>
          <div className="flex flex-grow flex-wrap justify-between md:items-center">
            <Link href={`/${post.metadata.slug}`}><span className="font-bold m-0">{post.metadata.title}</span></Link>
            <span className="text-gray-500">{post.metadata.date}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.metadata.tags.map((tag: string) => (
              <span key={tag} className="border rounded px-2 py-1 text-sm border-gray-400 border-b-blue-ribbon-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
