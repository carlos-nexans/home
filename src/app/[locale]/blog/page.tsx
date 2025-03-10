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
  params: { locale: string };
}) => {
  const { locale } = await params;
  return metadata[locale as keyof typeof metadata];
};

export default function Page() {
  return (
    <div>
      <h1 className="text-[32px] font-bold">Blog</h1>
    </div>
  );
}
