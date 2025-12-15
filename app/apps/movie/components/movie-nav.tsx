"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";

import Container from "@/components/layout/container";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

type MovieType = {
  title: string;
  params?: "movie" | "series" | "hoathinh" | "tv-shows";
  type_list?: "phim-le" | "phim-bo" | "hoat-hinh" | "tv-shows";
};

const movieTypes: MovieType[] = [
  { title: "Home" },
  {
    title: "Movie",
    params: "movie",
    type_list: "phim-le",
  },
  {
    title: "Series",
    params: "series",
    type_list: "phim-bo",
  },
  {
    title: "Animation",
    params: "hoathinh",
    type_list: "hoat-hinh",
  },
  {
    title: "TV Shows",
    params: "tv-shows",
    type_list: "tv-shows",
  },
];

export default function MovieNav() {
  const params = useParams();

  return (
    <div className="sticky top-0 z-50 bg-background">
      <Container className="flex items-center justify-between py-4">
        <div className="w-fit rounded-xl bg-muted p-1">
          {movieTypes.map((type) => (
            <Button
              key={type.title}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "hover:bg-background hover:text-foreground dark:hover:bg-foreground dark:hover:text-background",
                type.params === params.type && "bg-background",
              )}
            >
              <Link
                href={
                  type?.params ? `/apps/movie/${type?.params}` : `/apps/movie`
                }
              >
                {type.title}
              </Link>
            </Button>
          ))}
        </div>
        <InputGroup className="max-w-64 bg-muted">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search..." />
        </InputGroup>
        <Button variant="ghost" size="icon" className="bg-muted lg:hidden">
          <Search />
        </Button>
      </Container>
    </div>
  );
}
