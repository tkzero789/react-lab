import { Button } from "@/components/ui/button";
import { CassetteTape, Menu } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type MovieGenre = {
  title: string;
  params: string;
};

const movieGenres: MovieGenre[] = [
  {
    title: "Drama",
    params: "phim-bo",
  },
  {
    title: "Movie",
    params: "phim-le",
  },
  {
    title: "TV Shows",
    params: "tv-shows",
  },
  {
    title: "Cartoon",
    params: "hoat-hinh",
  },
  {
    title: "Vietsub",
    params: "phim-vietsub",
  },
  {
    title: "Dubbed",
    params: "phim-thuyet-minh",
  },
  {
    title: "Narration",
    params: "phim-long-tieng",
  },
];

export default function MovieNav() {
  return (
    <div className="sticky top-0 z-50 flex items-center border-b bg-accent p-4">
      <Button asChild size="icon-sm" className="mr-3">
        <Link href="/apps/movie">
          <CassetteTape />
        </Link>
      </Button>
      {movieGenres.map((genre: MovieGenre) => (
        <Button
          key={genre.title}
          asChild
          variant="link"
          size="sm"
          className="hidden hover:no-underline lg:flex"
        >
          <Link
            href={`https://phimapi.com/v1/api/danh-sach/${genre.params}`}
            className="truncate"
          >
            {genre.title}
          </Link>
        </Button>
      ))}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="ml-auto lg:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className="border-l-0 p-0">
          <SheetHeader>
            <SheetTitle className="p-4">Movie Genres</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col pb-4">
            {movieGenres.map((genre: MovieGenre) => (
              <Button
                key={genre.title}
                asChild
                variant="link"
                size="sm"
                className="justify-start rounded-none border-b px-4 py-6 first:border-t hover:no-underline lg:hidden"
              >
                <Link
                  href={`https://phimapi.com/v1/api/danh-sach/${genre.params}`}
                  className="truncate"
                >
                  {genre.title}
                </Link>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
