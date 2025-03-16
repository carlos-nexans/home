"use client"
import { cn } from "@/lib/utils"
import { useLocale } from "next-intl"
import {Link} from "@/i18n/navigation"

export function LanguageSwitcher() {
  const locale = useLocale()
  return (
    <div className="flex items-center space-x-2">
      <Link
        locale="es"
        href={"/"}
        className={cn(
          "transition-all duration-200 text-lg font-medium pb-1 border-b-1 border-scooter-400 hover:text-scooter-400",
          locale === "es" ? "text-gray-900" : "text-muted-foreground",
        )}
      >
        Español
      </Link>
      <Link
        locale="en"
        href={"/"}
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

