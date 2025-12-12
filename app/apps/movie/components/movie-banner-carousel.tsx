"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselPrev,
  usePrevNextButtons,
} from "@/components/ui/carousel";

import useEmblaCarousel from "embla-carousel-react";
import { Skeleton } from "@/components/ui/skeleton";

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

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const { onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  React.useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await fetch(
          `https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3`,
        );
        const data = await response.json();
        setMovies(data.items);
      } catch (error) {
        console.error(error);
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

  if (!movies) {
    return <Skeleton className="h-56 md:h-[400px] lg:h-[550px] xl:h-[700px]" />;
  }

  return (
    <div className="relative">
      <Carousel ref={emblaRef}>
        {movies.map((movie) => (
          <CarouselItem key={movie._id}>
            <Link
              href={`/apps/movie/${movie.slug}`}
              title={movie.name}
              className="relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://phimapi.com/image.php?url=${movie.thumb_url}`}
                alt={movie.name}
                width={1280}
                className="h-full w-full"
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
            </Link>
          </CarouselItem>
        ))}
      </Carousel>
      <CarouselPrev
        onClick={onPrevButtonClick}
        className="hidden h-12 w-12 rounded-full bg-secondary/20 text-background hover:bg-secondary/40 lg:flex [&_svg]:size-10"
      />
      <CarouselNext
        onClick={onNextButtonClick}
        className="hidden h-12 w-12 rounded-full bg-secondary/20 text-background hover:bg-secondary/40 lg:flex [&_svg]:size-10"
      />
    </div>
  );
}
