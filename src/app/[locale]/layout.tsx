import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/header";
import { Geist } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "@/styles/highlight-js/github-dark.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased px-6 lg:px-0`}
      >
        <div className="flex flex-col min-h-screen max-w-screen-md mx-auto">
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="markdown-content">{children}</main>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
