"use client"

import Image from "next/image"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { RotateCwIcon, StarIcon, TriangleAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContainer,
  CarouselItem,
  CarouselNext,
  CarouselPrev,
  usePrevNextButtons,
} from "@/components/ui/carousel"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import useEmblaCarousel from "embla-carousel-react"
import { Skeleton } from "@/components/ui/skeleton"
import Container from "@/components/layout/container"
import Autoplay from "embla-carousel-autoplay"
import { pathClient } from "@/lib/path-client"
import {
  fetchLatestMovies,
  imageUrl,
  movieRating,
  movieTypeSegment,
} from "../movie"

export default function MovieBannerCarousel() {
  const {
    data,
    isPending,
    isError,
    refetch,
    isFetching: isRetrying,
  } = useQuery({
    queryKey: ["movie", "latest"],
    queryFn: ({ signal }) => fetchLatestMovies({ page: 1 }, { signal }),
    staleTime: 5 * 60 * 1000,
  })

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000 }),
  ])

  const { onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)

  if (isPending) {
    return (
      <Container className="max-w-full px-0 lg:max-w-7xl lg:px-4">
        <Skeleton className="h-56 rounded-none md:h-100 lg:h-137.5 lg:rounded-xl xl:h-175" />
      </Container>
    )
  }

  if (isError) {
    return (
      <Container className="max-w-full px-0 lg:max-w-7xl lg:px-4">
        <Empty className="h-56 border md:h-100 lg:h-137.5 lg:rounded-xl xl:h-175">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TriangleAlertIcon />
            </EmptyMedia>
            <EmptyTitle>Couldn&apos;t load films</EmptyTitle>
            <EmptyDescription>
              The vsmov feed didn&apos;t respond.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              disabled={isRetrying}
              onClick={() => refetch()}
            >
              <RotateCwIcon data-icon="inline-start" />
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      </Container>
    )
  }

  return (
    <Container className="px-0 lg:px-4">
      <div className="relative">
        <Carousel ref={emblaRef} className="lg:rounded-xl">
          <CarouselContainer>
            {data.items.map((movie, index) => {
              // thumb_url is the landscape still; poster_url is portrait.
              const banner =
                imageUrl(movie.thumb_url) ?? imageUrl(movie.poster_url)
              const rating = movieRating(movie.tmdb)

              return (
                <CarouselItem key={movie._id}>
                  <Link
                    href={pathClient(
                      `/apps/movie/${movieTypeSegment(undefined, movie.tmdb)}/${movie.slug}`
                    )}
                    title={movie.name}
                    className="relative block"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      {banner ? (
                        <Image
                          src={banner}
                          alt={movie.name}
                          fill
                          sizes="(min-width: 1024px) 1280px, 100vw"
                          priority={index === 0}
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="absolute right-2 bottom-2 left-2 flex flex-col gap-1 rounded-xl bg-secondary/50 p-2 text-secondary-foreground backdrop-blur-xs lg:right-6 lg:bottom-6 lg:left-6 lg:gap-4 lg:p-6 dark:bg-muted/50 dark:text-foreground">
                      {/* Name */}
                      <div className="text-lg font-medium lg:text-2xl">
                        {movie.name}
                      </div>
                      {/* Additional details */}
                      <div className="flex items-center gap-2">
                        {movie.origin_name ? (
                          <>
                            <div className="truncate text-sm lg:text-lg">
                              {movie.origin_name}
                            </div>
                            <div className="-translate-y-px">|</div>
                          </>
                        ) : null}
                        <div className="text-sm lg:text-lg">{movie.year}</div>
                        {rating ? (
                          <>
                            <div className="-translate-y-px">|</div>
                            <div className="flex items-center gap-1 text-sm lg:text-lg">
                              <StarIcon className="size-4 fill-current" />
                              {rating}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContainer>
        </Carousel>
        <CarouselPrev
          onClick={onPrevButtonClick}
          className="absolute top-1/2 left-6 hidden h-12 w-12 -translate-y-1/2 rounded-full bg-secondary/20 text-background hover:bg-secondary/40 lg:flex dark:bg-muted/20 dark:text-foreground dark:hover:bg-muted/40 [&_svg]:size-10"
        />
        <CarouselNext
          onClick={onNextButtonClick}
          className="absolute top-1/2 right-6 hidden h-12 w-12 -translate-y-1/2 rounded-full bg-secondary/20 text-background hover:bg-secondary/40 lg:flex dark:bg-muted/20 dark:text-foreground dark:hover:bg-muted/40 [&_svg]:size-10"
        />
      </div>
    </Container>
  )
}
