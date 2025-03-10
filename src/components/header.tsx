"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import Image from "next/image";

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
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 my-8">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href={basePath || "/"} className="flex items-center space-x-2">
            <Image src="/brand/logo.png" alt="logo" width={24} height={24} />
          </Link>
          <nav className="hidden gap-6 md:flex">
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
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
