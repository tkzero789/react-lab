"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Search } from "lucide-react"
import Container from "@/components/layout/container"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import MovieFilter from "./movie-filter"
import MovieMenu from "./movie-menu"
import { pathClient } from "@/lib/path-client"
import Link from "next/link"
import { MOVIE_BROWSE } from "../movie"

const navTabs = [{ segment: undefined, title: "Home" }, ...MOVIE_BROWSE]

export default function MovieNav() {
  const params = useParams()

  return (
    <div className="sticky top-0 z-50 bg-background">
      <Container className="flex items-center justify-between py-4">
        <div className="hidden h-10 w-fit items-center rounded-xl bg-muted p-1 lg:flex">
          {navTabs.map((tab) => (
            <Link
              key={tab.title}
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-full border-0 bg-muted px-3 text-foreground hover:bg-transparent",
                tab.segment === params.type &&
                  "bg-background text-foreground hover:bg-background hover:text-foreground"
              )}
              href={pathClient(
                tab.segment ? `/apps/movie/${tab.segment}` : `/apps/movie`
              )}
            >
              {tab.title}
            </Link>
          ))}
        </div>
        <MovieMenu paramsType={params?.type as string} />
        <div className="flex items-center gap-2 lg:gap-4">
          {params.type && <MovieFilter />}
          <Button variant="muted">
            <Search />
            <span className="hidden lg:block">Search</span>
          </Button>
        </div>
      </Container>
    </div>
  )
}
