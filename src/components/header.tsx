"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { Link } from "@/i18n/navigation";

export function Header() {
  const pathname = usePathname();
  const isSpanish = pathname.startsWith("/es");
  const basePath = isSpanish ? "/es" : "";

  const t = useTranslations();
  const navItems = [
    { name: t("header.home"), path: `${basePath}/` },
    { name: t("header.blog"), path: `${basePath}/blog` },
  ];

  return (
    <header className="my-8">
      <div className="container flex flex-col lg:flex-row items-center justify-between">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          <Link href={basePath || "/"} className="flex items-center space-x-2">
            <Image src="/brand/logo.png" alt="logo" width={24} height={24} />
          </Link>
          <nav className="gap-6 flex flex-row flex-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary",
                  pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
