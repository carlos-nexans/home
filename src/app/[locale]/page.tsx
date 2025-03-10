import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import "./home.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  try {
    const Content = (await import(`./${locale}.mdx`)).default;
    return (
      <div className="home">
        <Content />
      </div>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
}
