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
import Link from "next/link";
import { ButtonGroup } from "@/components/ui/button-group";

type MovieDetail = {
  name: string;
  origin_name: string;
  slug: string;
  content: string;
  thumb_url: string;
  poster_url: string;
  time: string;
  episode_current: string;
  quality: string;
  year: number;
  actor: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  }[];
};

export default function MovieDramaCarousel() {
  const [movies, setMovies] = React.useState<MovieDetail[]>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await fetch(
          `https://phimapi.com/v1/api/danh-sach/phim-bo`,
        );
        const data = await response.json();
        setMovies(data.data.items);
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
    <Carousel className="flex flex-col gap-4 overflow-auto rounded-xl">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Drama</div>
        <ButtonGroup>
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </ButtonGroup>
      </div>
      <CarouselContent className="-ml-1 rounded-xl">
        {isLoading ? (
          <CarouselItem className="pl-0">
            <Skeleton className="h-56 sm:h-[26rem] lg:h-[30rem]" />
          </CarouselItem>
        ) : (
          movies &&
          movies.map((movie: MovieDetail) => (
            <CarouselItem
              key={movie.slug}
              className="relative basis-1/2 overflow-hidden rounded-xl pl-1 transition-all xl:basis-1/3"
            >
              <Link href={`/apps/movie/${movie.slug}`} title={movie.name}>
                <div className="relative h-56 sm:h-[26rem] lg:h-[30rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://phimapi.com/image.php?url=https://phimimg.com/${movie.poster_url}`}
                    alt={movie.name}
                    width={600}
                    height={900}
                    className="h-full w-full rounded-xl object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-1 rounded-xl bg-secondary/50 p-2 backdrop-blur-sm lg:bottom-6 lg:left-6 lg:right-6 lg:gap-2 lg:p-6">
                    {/* Name */}
                    <div className="truncate text-sm font-semibold text-background lg:text-lg">
                      {movie.name}
                    </div>
                    {/* Additional details */}
                    <div className="flex items-center gap-2 text-background">
                      <div className="text-sm lg:text-base">
                        {movie.quality}
                      </div>
                      <div className="translate-y-[-1px]">|</div>
                      <div className="text-sm lg:text-base">
                        {getTotalEpisodes(movie.episode_current)} tập
                      </div>
                      <div className="hidden translate-y-[-1px] md:block">
                        |
                      </div>
                      <div className="hidden text-sm md:block lg:text-base">
                        {movie.time}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))
        )}
      </CarouselContent>
    </Carousel>
  );
}
