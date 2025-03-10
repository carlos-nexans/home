"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../lib/utils"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Zap } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const isSpanish = pathname.startsWith("/es")
  const basePath = isSpanish ? "/es" : ""

  const navItems = [
    { name: isSpanish ? "Inicio" : "Home", path: `${basePath}/` },
    { name: "Blog", path: `${basePath}/blog` },
    { name: isSpanish ? "Tutoriales" : "Tutorials", path: `${basePath}/tutorials` },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href={basePath || "/"} className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary" />
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.path ? "text-primary" : "text-muted-foreground",
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
  )
}

