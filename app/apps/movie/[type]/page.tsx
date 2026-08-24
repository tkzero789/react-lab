"use client"

import { notFound, useParams, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import DashboardBreadcrumb from "../../components/dashboard-breadcrumb"
import MovieNav from "../components/movie-nav"
import MovieCard from "../components/movie-card"
import { Skeleton } from "@/components/ui/skeleton"
import MoviePagination from "../components/movie-pagination"
import Container from "@/components/layout/container"
import { pathClient } from "@/lib/path-client"
import { fetchMovieList, getBrowseTab } from "../movie"

export default function MovieTypePage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const segment = typeof params.type === "string" ? params.type : undefined
  const tab = getBrowseTab(segment)
  const currentPage = Number(searchParams.get("page")) || 1

  const { data, isPending } = useQuery({
    queryKey: ["movie", "list", segment, currentPage],
    queryFn: ({ signal }) =>
      fetchMovieList(tab!.path, { page: currentPage }, { signal }),
    enabled: Boolean(tab),
    staleTime: 5 * 60 * 1000,
  })

  // Anything outside MOVIE_BROWSE has no endpoint behind it.
  if (!tab) notFound()

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
            title: tab.title,
          },
        ]}
      />
      <MovieNav />
      <Container className="flex flex-col gap-8 pb-18">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
          {isPending || !data
            ? Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-64 overflow-hidden rounded-xl min-[425px]:h-80 sm:h-72 lg:h-88"
                />
              ))
            : data.items.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  segment={tab.segment}
                />
              ))}
        </div>
        <MoviePagination
          path={pathClient(`/apps/movie/${segment}`)}
          currentPage={currentPage}
          totalPages={data?.pagination.totalPages ?? 0}
        />
      </Container>
    </>
  )
}
