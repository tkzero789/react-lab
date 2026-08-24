"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb"
import DashboardContainer from "@/components/layout/dashboard-container"
import { buttonVariants } from "@/components/ui/button"
import MovieVideo from "../../../components/movie-video"
import { pathClient } from "@/lib/path-client"
import { cn } from "@/lib/utils"
import {
  cleanServerName,
  fetchMovieDetail,
  getBrowseTab,
  movieTypeSegment,
} from "../../../movie"

export default function EpisodePage() {
  const params = useParams()
  const slug = typeof params.slug === "string" ? params.slug : ""
  const episodeSlug =
    typeof params.episode === "string" ? params.episode : undefined

  const { data } = useQuery({
    queryKey: ["movie", "detail", slug],
    queryFn: ({ signal }) => fetchMovieDetail(slug, { signal }),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  })

  const movie = data?.movie
  const segment = movieTypeSegment(movie?.type, movie?.tmdb)
  const tab = getBrowseTab(segment)

  // The episode can live on any server, so search them all.
  const current = data?.episodes
    .flatMap((server) => server.server_data)
    .find((episode) => episode.slug === episodeSlug)

  const episodeLabel =
    episodeSlug === "full" ? "Full" : `Tập ${current?.name ?? ""}`.trim()

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
            href: pathClient(`/apps/movie/${segment}/${slug}`),
          },
          { title: episodeLabel },
        ]}
      />
      <DashboardContainer className="flex flex-col gap-8">
        <MovieVideo source={current?.link_embed ?? ""} />
        {data?.episodes.map((server) => (
          <div key={server.server_name} className="flex flex-col gap-2">
            <div className="font-semibold">
              {cleanServerName(server.server_name)}:
            </div>
            <div className="flex flex-wrap gap-1">
              {server.server_data.map((episode) => (
                <Link
                  key={episode.slug}
                  href={pathClient(
                    `/apps/movie/${segment}/${slug}/${episode.slug}`
                  )}
                  className={cn(
                    buttonVariants({
                      variant:
                        episode.slug === episodeSlug ? "default" : "secondary",
                      size: "sm",
                    })
                  )}
                >
                  {episode.slug === "full" ? "Full" : `Tập ${episode.name}`}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </DashboardContainer>
    </>
  )
}
