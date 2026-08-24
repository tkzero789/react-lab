"use client"

import { useQuery } from "@tanstack/react-query"
import { ChevronLeft } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Carousel,
  CarouselContainer,
  CarouselItem,
  CarouselNext,
  usePrevNextButtons,
} from "@/components/ui/carousel"
import { ButtonGroup } from "@/components/ui/button-group"
import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import MovieCard from "./movie-card"
import { fetchMovieList, getBrowseTab } from "../movie"
import type { MovieBrowseSegment } from "../movie"

type Props = {
  segment: MovieBrowseSegment
}

export default function MovieCarousel({ segment }: Props) {
  const tab = getBrowseTab(segment)

  const { data, isPending } = useQuery({
    queryKey: ["movie", "list", segment],
    queryFn: ({ signal }) => fetchMovieList(tab!.path, { page: 1 }, { signal }),
    enabled: Boolean(tab),
    staleTime: 5 * 60 * 1000,
  })

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: "auto",
  })

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi)

  if (!tab) return null

  if (isPending || !data) {
    return (
      <Container className="flex flex-col gap-4">
        <h2 className="text-2xl">{tab.title}</h2>
        <div
          className={cn(
            "flex gap-4",
            `[&>*:nth-child(3)]:hidden sm:[&>*:nth-child(3)]:block`,
            `[&>*:nth-child(4)]:hidden xl:[&>*:nth-child(4)]:block`,
            `[&>*:nth-child(5)]:hidden 2xl:[&>*:nth-child(5)]:block`
          )}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-64 min-[425px]:h-80 sm:h-72 lg:h-88"
            />
          ))}
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2>{tab.title}</h2>
          <ButtonGroup>
            <Button
              variant="muted"
              size="icon-sm"
              disabled={prevBtnDisabled}
              onClick={onPrevButtonClick}
              className="shadow-none disabled:opacity-40"
            >
              <ChevronLeft />
            </Button>
            <CarouselNext
              variant="muted"
              size="icon-sm"
              disabled={nextBtnDisabled}
              onClick={onNextButtonClick}
              className="shadow-none disabled:opacity-40"
            />
          </ButtonGroup>
        </div>
        <div>
          <Carousel ref={emblaRef}>
            <CarouselContainer className="-ml-4">
              {data.items.map((movie) => (
                <CarouselItem
                  key={movie._id}
                  className="basis-1/2 pl-4 sm:basis-1/3 md:basis-1/2 xl:basis-1/4 2xl:basis-1/5"
                >
                  <MovieCard movie={movie} segment={segment} />
                </CarouselItem>
              ))}
            </CarouselContainer>
          </Carousel>
        </div>
      </div>
    </Container>
  )
}
