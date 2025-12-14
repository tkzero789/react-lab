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

type MovieGenre = {
  title: string;
  params: string;
};

const movieGenres: MovieGenre[] = [
  {
    title: "Movie",
    params: "phim-le",
  },
  {
    title: "Series",
    params: "phim-bo",
  },
  {
    title: "Animation",
    params: "hoat-hinh",
  },
  {
    title: "TV Shows",
    params: "tv-shows",
  },
];

export default function MovieNav() {
  return (
    <div className="sticky top-0 z-50 bg-background">
      <Container className="flex items-center justify-between py-4">
        <div className="w-fit rounded-xl bg-muted p-1">
          {movieGenres.map((genre) => (
            <Button
              key={genre.title}
              asChild
              variant="ghost"
              size="sm"
              className="hover:bg-background dark:hover:bg-secondary dark:hover:text-secondary-foreground"
            >
              <Link href={genre.params}>{genre.title}</Link>
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
