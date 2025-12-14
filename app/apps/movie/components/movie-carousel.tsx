"use client";

import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Carousel,
  CarouselContainer,
  CarouselItem,
  CarouselNext,
  CarouselPrev,
  usePrevNextButtons,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ButtonGroup } from "@/components/ui/button-group";
import Container from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

type Props = {
  title: string;
  type_list: string;
};

export default function MovieCarousel({ title, type_list }: Props) {
  const [movies, setMovies] = React.useState<MovieDetail[]>();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: "auto",
  });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  React.useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await fetch(
          `https://phimapi.com/v1/api/danh-sach/${type_list}`,
        );
        const data = await response.json();
        setMovies(data.data.items);
      } catch (error) {
        console.error(error);
      }
    };
    getMovies();
  }, [type_list]);

  const getTotalEpisodes = (currentEpisode: string) => {
    if (currentEpisode.startsWith("Tập")) {
      return currentEpisode.split(" ")[1];
    } else {
      return currentEpisode?.split("/")[1]?.split(")")[0];
    }
  };

  if (!movies) {
    return (
      <Container className="flex flex-col gap-4">
        <h2 className="text-2xl">{title}</h2>
        <div className="flex gap-4">
          <Skeleton className="h-56 md:h-[470px] lg:h-[550px]" />
          <Skeleton className="h-56 md:h-[470px] lg:h-[550px]" />
          <Skeleton className="hidden h-56 md:h-[470px] lg:block lg:h-[550px]" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <ButtonGroup>
            <CarouselPrev
              variant="surface"
              size="icon-sm"
              disabled={prevBtnDisabled}
              onClick={onPrevButtonClick}
              className="static -translate-y-0"
            />
            <CarouselNext
              variant="surface"
              size="icon-sm"
              disabled={nextBtnDisabled}
              onClick={onNextButtonClick}
              className="static -translate-y-0"
            />
          </ButtonGroup>
        </CardHeader>
        <CardContent>
          <Carousel ref={emblaRef}>
            <CarouselContainer className="-ml-4">
              {movies &&
                movies.map((movie: MovieDetail) => (
                  <CarouselItem
                    key={movie.slug}
                    className="basis-1/2 pl-4 xl:basis-1/3"
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
                            {movie.episode_current !== "Full" && (
                              <div className="text-sm lg:text-base">
                                {getTotalEpisodes(movie.episode_current)} tập
                              </div>
                            )}
                            {movie.episode_current !== "Full" && (
                              <div className="hidden translate-y-[-1px] md:block">
                                |
                              </div>
                            )}
                            <div
                              className={cn(
                                "hidden text-sm md:block lg:text-base",
                                movie.episode_current === "Full" && "block",
                              )}
                            >
                              {movie.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
            </CarouselContainer>
          </Carousel>
        </CardContent>
      </Card>
    </Container>
  );
}
