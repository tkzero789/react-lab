import React from "react";
import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import MovieBannerCarousel from "./components/movie-banner-carousel";
import MovieNav from "./components/movie-nav";
import MovieCarousel from "./components/movie-carousel";

export default function MoviePage() {
  return (
    <>
      <DashboardBreadcrumb
        breadcrumbs={[
          {
            title: "Apps",
            href: "/",
          },
          {
            title: "Movie",
          },
        ]}
      />

      <MovieNav />
      <div className="flex flex-col gap-8 pb-4 lg:pb-4">
        <MovieBannerCarousel />
        <MovieCarousel title="Single" type_list="phim-le" />
        <MovieCarousel title="Series" type_list="phim-bo" />
        <MovieCarousel title="Animation" type_list="hoat-hinh" />
        <MovieCarousel title="TV Shows" type_list="tv-shows" />
      </div>
    </>
  );
}
