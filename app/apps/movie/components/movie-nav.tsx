"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import Container from "@/components/layout/container";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import MovieFilter from "./movie-filter";
import MovieMenu from "./movie-menu";
import { pathClient } from "@/lib/path-client";

type MovieType = {
  title: string;
  params?: "single" | "series" | "hoathinh" | "tv-shows";
  typeList?: "phim-le" | "phim-bo" | "hoat-hinh" | "tv-shows";
};

const movieTypes: MovieType[] = [
  { title: "Home" },
  {
    title: "Single",
    params: "single",
    typeList: "phim-le",
  },
  {
    title: "Series",
    params: "series",
    typeList: "phim-bo",
  },
  {
    title: "Animation",
    params: "hoathinh",
    typeList: "hoat-hinh",
  },
  {
    title: "TV Shows",
    params: "tv-shows",
    typeList: "tv-shows",
  },
];

export default function MovieNav() {
  const params = useParams();

  return (
    <div className="sticky top-0 z-50 bg-background">
      <Container className="flex items-center justify-between py-4">
        <div className="hidden h-10 w-fit items-center gap-1 rounded-xl bg-muted p-1 lg:flex">
          {movieTypes.map((type) => (
            <Button
              key={type.title}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "hover:bg-background hover:text-foreground dark:hover:bg-foreground dark:hover:text-background",
                type.params === params.type &&
                  "bg-background dark:bg-foreground dark:text-secondary-foreground",
              )}
            >
              <Link href={pathClient(type?.params ? `/apps/movie/${type?.params}` : `/apps/movie`)}>
                {type.title}
              </Link>
            </Button>
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
  );
}
