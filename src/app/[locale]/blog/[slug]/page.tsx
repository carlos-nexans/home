import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }: { params: { locale: string, slug: string } }) => {
  const { locale, slug } = await params;
  const metadata = (await import(`@/content/blog/${slug}/${locale}.mdx`)).metadata;
  return {
    title: metadata.title,
    description: metadata.description,
  };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: { params: { locale: string, slug: string } }) {
  const { locale, slug } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  try {
    const Content = (await import(`@/content/blog/${slug}/${locale}.mdx`)).default;
    return (
      <div>
        <Content />
      </div>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
}
