import React from "react"
import DashboardBreadcrumb from "../components/dashboard-breadcrumb"
import { pathServer } from "@/lib/path-server"
import MovieBannerCarousel from "./components/movie-banner-carousel"
import MovieNav from "./components/movie-nav"
import MovieCarousel from "./components/movie-carousel"
import { MOVIE_BROWSE } from "./movie"

export default async function MoviePage() {
  const appsHref = await pathServer("/apps")

  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          {
            title: "Apps",
            href: appsHref,
          },
          {
            title: "Movie",
          },
        ]}
      />

      <MovieNav />
      <div className="flex flex-col gap-12 pb-4 lg:pb-4">
        <MovieBannerCarousel />
        {MOVIE_BROWSE.map((tab) => (
          <MovieCarousel key={tab.segment} segment={tab.segment} />
        ))}
      </div>
    </>
  )
}
