import React from "react";
import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import MovieBannerCarousel from "./components/movie-banner-carousel";
import MovieNav from "./components/movie-nav";
import MovieDramaCarousel from "./components/movie-drama-carousel";

export default function MoviePage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          {
            title: "Apps",
            href: "/apps",
          },
          {
            title: "Movie",
          },
        ]}
      />

      <MovieNav />
      <div className="flex flex-col gap-8 pb-4 lg:py-4">
        <MovieBannerCarousel />
        <MovieDramaCarousel />
      </div>
    </>
  );
}
