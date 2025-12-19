"use client";

import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContainer,
  CarouselItem,
  CarouselNext,
  CarouselPrev,
  usePrevNextButtons,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import Container from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MovieCard from "./movie-card";
import { cn } from "@/lib/utils";
import styles from "./movie.module.css";

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
  title: string;
  type_list: string;
};

export default function MovieCarousel({ title, type_list }: Props) {
  const [movies, setMovies] = React.useState<Movie[]>();

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

  if (!movies) {
    return (
      <Container className="flex flex-col gap-4">
        <h2 className="text-2xl">{title}</h2>
        <div
          className={cn(
            "flex gap-4",
            `[&>*:nth-child(3)]:hidden sm:[&>*:nth-child(3)]:block`,
            `[&>*:nth-child(4)]:hidden xl:[&>*:nth-child(4)]:block`,
            `[&>*:nth-child(5)]:hidden 2xl:[&>*:nth-child(5)]:block`,
          )}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[16rem] min-[425px]:h-[20rem] sm:h-[18rem] lg:h-[22rem]"
            />
          ))}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <ButtonGroup className="group shadow">
            <CarouselPrev
              variant="outline"
              size="icon-sm"
              disabled={prevBtnDisabled}
              onClick={onPrevButtonClick}
              className={cn(
                "static -translate-y-0 border-r-0 shadow-none",
                styles.carouselPrev,
              )}
            />
            <ButtonGroupSeparator
              className={cn("transition-colors", styles.buttonGroupSeparator)}
            />
            <CarouselNext
              variant="outline"
              size="icon-sm"
              disabled={nextBtnDisabled}
              onClick={onNextButtonClick}
              className={cn(
                "static -translate-y-0 shadow-none",
                styles.carouselNext,
              )}
            />
          </ButtonGroup>
        </CardHeader>
        <CardContent>
          <Carousel ref={emblaRef}>
            <CarouselContainer className="-ml-4">
              {movies &&
                movies.map((movie: Movie) => (
                  <CarouselItem
                    key={movie.slug}
                    className="basis-1/2 pl-4 sm:basis-1/3 md:basis-1/2 xl:basis-1/4 2xl:basis-1/5"
                  >
                    <MovieCard movie={movie} />
                  </CarouselItem>
                ))}
            </CarouselContainer>
          </Carousel>
        </CardContent>
      </Card>
    </Container>
  );
}
