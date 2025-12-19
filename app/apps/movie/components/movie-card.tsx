import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

type Movie = {
  _id: string;
  name: string;
  type: string;
  slug: string;
  poster_url: string;
  thumb_url: string;
  time: string;
  episode_current: string;
  quality: string;
  year: number;
  category: {
    id: string;
    name: string;
    slug: string;
  }[];
};

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  const getTotalEpisodes = (currentEpisode: string) => {
    if (currentEpisode?.startsWith("Tập")) {
      return currentEpisode.split(" ")[1];
    } else {
      return currentEpisode?.split("/")[1]?.split(")")[0];
    }
  };

  return (
    <Link
      href={`/apps/movie/${movie.type === "tvshows" ? "tv-shows" : movie.type}/${movie.slug}`}
      className="group"
    >
      <div className="relative h-[16rem] overflow-hidden rounded-xl min-[425px]:h-[20rem] sm:h-[18rem] lg:h-[22rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://phimapi.com/image.php?url=https://phimimg.com/${movie.poster_url}`}
          alt={movie.name}
          width={600}
          height={900}
          className="h-full w-full rounded-xl object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
        />
        <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-1 rounded-xl bg-secondary/50 p-2 text-secondary-foreground backdrop-blur-sm dark:bg-muted/50 dark:text-foreground">
          {/* Name */}
          <div className="truncate text-sm font-medium lg:text-lg">
            {movie.name}
          </div>
          {/* Additional details */}
          <div className="flex items-center gap-2">
            <div className="text-sm lg:text-base">{movie.quality}</div>
            <div className="translate-y-[-1px]">|</div>
            {movie.episode_current !== "Full" && (
              <div className="text-sm lg:text-base">
                {getTotalEpisodes(movie.episode_current)} tập
              </div>
            )}
            {movie.episode_current === "Full" && (
              <div className={cn("text-sm lg:text-base")}>{movie.time}</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
