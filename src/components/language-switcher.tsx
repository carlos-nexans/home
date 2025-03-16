"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLocale } from "next-intl"
type Language = "es" | "en"

export function LanguageSwitcher() {
  const locale = useLocale()
  return (
    <div className="flex items-center space-x-2">
      <Link
        href={`/${locale === "es" ? "en" : "es"}`}
        className={cn(
          "transition-all duration-200 text-lg font-medium pb-1 border-b-1 border-scooter-400 hover:text-scooter-400",
          locale === "es" ? "text-gray-900" : "text-muted-foreground",
        )}
      >
        Español
      </Link>
      <Link
        href={`/${locale === "es" ? "en" : "es"}`}
        className={cn(
          "transition-all duration-200 text-lg font-medium pb-1 border-b-1 border-scooter-400 hover:text-scooter-400",
          locale === "en" ? "text-gray-900" : "text-muted-foreground",
        )}
      >
        English
      </Link>
    </div>
  )
}

