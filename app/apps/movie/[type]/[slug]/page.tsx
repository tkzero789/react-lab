"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { StarIcon } from "lucide-react"

import DashboardContainer from "@/components/layout/dashboard-container"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import { Skeleton } from "@/components/ui/skeleton"
import { pathClient } from "@/lib/path-client"
import { cn } from "@/lib/utils"
import {
  cleanServerName,
  fetchMovieDetail,
  getBrowseTab,
  getTotalEpisodes,
  imageUrl,
  movieRating,
  movieTypeSegment,
} from "../../movie"

export default function MovieDetailPage() {
  const params = useParams()
  const slug = typeof params.slug === "string" ? params.slug : ""

  const { data } = useQuery({
    queryKey: ["movie", "detail", slug],
    queryFn: ({ signal }) => fetchMovieDetail(slug, { signal }),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  })

  const movie = data?.movie
  const segment = movieTypeSegment(movie?.type, movie?.tmdb)
  const tab = getBrowseTab(segment)

  // thumb_url is the landscape still; poster_url is portrait.
  const banner = movie
    ? (imageUrl(movie.thumb_url) ?? imageUrl(movie.poster_url))
    : null
  const totalEpisodes =
    movie && movie.episode_current !== "Full"
      ? getTotalEpisodes(movie.episode_current)
      : null
  const rating = movieRating(movie?.tmdb)

  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          {
            title: "Apps",
            href: pathClient("/apps"),
          },
          {
            title: "Movie",
            href: pathClient("/apps/movie"),
          },
          {
            title: tab?.title ?? "",
            href: pathClient(`/apps/movie/${segment}`),
          },
          {
            title: movie?.name ?? "",
          },
        ]}
      />
      <DashboardContainer>
        <div className="flex flex-col gap-4">
          {!movie ? (
            <Skeleton className="h-56 md:h-[400px] lg:h-[550px] xl:h-[700px]" />
          ) : (
            <div className="relative">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
                {banner ? (
                  <Image
                    src={banner}
                    alt={movie.name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 1280px, 100vw"
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
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm lg:text-lg">{movie.quality}</div>
                  <div className="-translate-y-px">|</div>
                  <div className="text-sm lg:text-lg">{movie.year}</div>
                  {totalEpisodes ? (
                    <>
                      <div className="-translate-y-px">|</div>
                      <div className="text-sm lg:text-lg">
                        {totalEpisodes} tập
                      </div>
                    </>
                  ) : null}
                  <div className="-translate-y-px">|</div>
                  <div className="text-sm lg:text-lg">{movie.time} phút</div>
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
                {/* Category */}
                <div className="hidden items-center gap-2 lg:flex">
                  {movie.category.map((item) => (
                    <Badge key={item.id}>{item.name}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!movie ? (
            <Skeleton className="flex h-96 flex-col gap-4 lg:h-48" />
          ) : (
            <div className="flex flex-col gap-4">
              {/* Content */}
              {movie.content ? (
                <div className="rounded-xl bg-muted p-4">{movie.content}</div>
              ) : null}
              {/* Categories */}
              <div className="flex flex-col gap-2 lg:hidden">
                <div className="font-semibold">Categories:</div>
                <div className="flex flex-wrap items-center gap-2">
                  {movie.category.map((item) => (
                    <Badge key={item.id} className="whitespace-nowrap">
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
              {/* Countries */}
              {movie.country.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="font-semibold">Countries:</div>
                  <div className="flex flex-wrap items-center gap-2">
                    {movie.country.map((item) => (
                      <Badge
                        key={item.id}
                        variant="muted"
                        className="whitespace-nowrap"
                      >
                        {item.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
              {/* Actors */}
              {movie.actor.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="font-semibold">Actors:</div>
                  <div className="flex flex-wrap items-center gap-2">
                    {movie.actor.map((item, index) => (
                      <Badge
                        key={`${item}-${index}`}
                        variant="muted"
                        className="whitespace-nowrap"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
              {/* Episodes */}
              {data.episodes.map((server) => (
                <div key={server.server_name} className="flex flex-col gap-2">
                  <div className="font-semibold">
                    {cleanServerName(server.server_name)}:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {server.server_data.map((episode) => (
                      <Link
                        key={episode.slug}
                        href={pathClient(
                          `/apps/movie/${segment}/${movie.slug}/${episode.slug}`
                        )}
                        className={cn(
                          buttonVariants({ variant: "secondary", size: "sm" })
                        )}
                      >
                        {episode.slug === "full"
                          ? "Full"
                          : `Tập ${episode.name}`}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardContainer>
    </>
  )
}
