import Link from "next/link";
import React from "react";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import "./Movie.css";

type Movie = {
  name: string;
  slug: string;
  poster_url: string;
  year: number;
};

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  return (
    <Link
      href={`/apps/movie/${movie.slug}`}
      className="flex h-full flex-col rounded-xl border bg-card"
    >
      <div className="movie-image group relative p-2">
        <div className="relative overflow-hidden rounded-xl lg:h-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://phimapi.com/image.php?url=${movie.poster_url}`}
            alt={movie.name}
            width={600}
            height={900}
            className="aspect-[2/3] h-full w-full rounded-xl object-cover transition-all duration-300 group-hover:scale-105"
          />
          <Badge className="absolute right-2 top-2">{movie.year}</Badge>
        </div>
        <div className="movie-info-layer absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-t-md bg-muted/20">
          <div className="rounded-xl p-4">
            <Play
              className="h-10 w-10 text-primary-foreground"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
      <div className="rounded-b-xl px-4 pb-2">
        <div className="truncate font-semibold">{movie.name}</div>
      </div>
    </Link>
  );
}
