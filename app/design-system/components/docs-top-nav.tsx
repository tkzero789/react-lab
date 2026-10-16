"use client"

/* Sticky top bar with the design system sections and the search */

import Link from "next/link"
import { usePathname } from "next/navigation"

import Container from "@/components/layout/container"
import { pathClient } from "@/lib/path-client"
import { cn } from "@/lib/utils"

import DocsSearch from "./docs-search"

const tabs = [
  { title: "Overview", url: "/design-system" },
  { title: "Tokens", url: "/design-system/tokens" },
]

export default function DocsTopNav() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-10 col-span-full row-start-2 border-b bg-background">
      <Container className="flex h-14 items-center justify-between gap-4">
        <nav
          aria-label="Design system"
          className="flex h-9 items-center rounded-full bg-muted p-1"
        >
          {tabs.map((tab) => {
            const url = pathClient(tab.url)
            const isActive = pathname === url
            return (
              <Link
                key={tab.url}
                href={url}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-full items-center rounded-full px-3 text-sm font-medium text-muted-foreground pressable hover:text-foreground active:text-foreground",
                  isActive && "bg-background text-foreground"
                )}
              >
                {tab.title}
              </Link>
            )
          })}
        </nav>
        <DocsSearch />
      </Container>
    </div>
  )
}
