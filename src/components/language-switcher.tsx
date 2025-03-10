"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type Language = "es" | "en"

export function LanguageSwitcher() {
  const pathname = usePathname()
  const currentLang = pathname.startsWith("/es") ? "es" : "en"

  const getLanguagePath = (lang: Language) => {
    if (currentLang === lang) return pathname

    // Remove current language prefix and add new one
    const path = pathname.replace(/^\/(es|en)/, "")
    return `/${lang}${path}`
  }

  return (
    <div className="flex items-center space-x-2">
      <Link
        href={getLanguagePath("es")}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          currentLang === "es" ? "text-primary underline underline-offset-4" : "text-muted-foreground",
        )}
      >
        Español
      </Link>
      <Link
        href={getLanguagePath("en")}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          currentLang === "en" ? "text-primary underline underline-offset-4" : "text-muted-foreground",
        )}
      >
        English
      </Link>
    </div>
  )
}

