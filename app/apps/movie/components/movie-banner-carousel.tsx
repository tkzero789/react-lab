"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Movie = {
  _id: string;
  name: string;
  slug: string;
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

export default function MovieBannerCarousel() {
  const [movies, setMovies] = React.useState<Movie[]>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await fetch(
          `https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3`,
        );
        const data = await response.json();
        setMovies(data.items);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    getMovies();
  }, []);

  const getTotalEpisodes = (currentEpisode: string) => {
    if (currentEpisode.startsWith("Tập")) {
      return currentEpisode.split(" ")[1];
    } else {
      return currentEpisode?.split("/")[1]?.split(")")[0];
    }
  };

  return (
    <Carousel className="overflow-auto rounded-xl">
      <CarouselContent className="-ml-0 rounded-xl">
        {isLoading ? (
          <CarouselItem className="pl-0">
            <Skeleton className="h-[220px] lg:h-[700px]" />
          </CarouselItem>
        ) : (
          movies &&
          movies.map((movie: Movie) => (
            <CarouselItem
              key={movie.slug}
              className="relative overflow-hidden rounded-xl pl-0 transition-all"
            >
              <Link href={`/apps/movie/${movie.slug}`} title={movie.name}>
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://phimapi.com/image.php?url=${movie.thumb_url}`}
                    alt={movie.name}
                    width={1280}
                    height={1000}
                    className="rounded-xl"
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-1 rounded-xl bg-secondary/50 p-2 backdrop-blur-sm lg:bottom-6 lg:left-6 lg:right-6 lg:gap-4 lg:p-6">
                    {/* Name */}
                    <div className="text-lg font-semibold text-background lg:text-2xl">
                      {movie.name}
                    </div>
                    {/* Additional details */}
                    <div className="flex items-center gap-2 text-background">
                      <div className="text-sm lg:text-lg">{movie.quality}</div>
                      <div className="translate-y-[-1px]">|</div>
                      <div className="text-sm lg:text-lg">{movie.year}</div>
                      <div className="translate-y-[-1px]">|</div>
                      <div className="text-sm lg:text-lg">
                        {getTotalEpisodes(movie.episode_current)} tập
                      </div>
                      <div className="translate-y-[-1px]">|</div>
                      <div className="text-sm lg:text-lg">{movie.time}</div>
                    </div>
                    {/* Category */}
                    <div className="hidden items-center gap-2 lg:flex">
                      {movie.category.map((item) => (
                        <Badge key={item.id}>{item.name}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      <CarouselPrevious
        variant="ghost"
        className="left-6 hidden h-12 w-12 bg-secondary/20 text-background hover:bg-secondary/40 lg:flex [&_svg]:size-10"
      />
      <CarouselNext
        variant="ghost"
        className="right-6 hidden h-12 w-12 bg-secondary/20 text-background hover:bg-secondary/40 lg:flex [&_svg]:size-10"
      />
    </Carousel>
  );
}
