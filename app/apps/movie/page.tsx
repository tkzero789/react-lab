import React from "react";
import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
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
      <DashboardContainer className="flex flex-col gap-4">
        <MovieBannerCarousel />
        <MovieDramaCarousel />
      </DashboardContainer>
    </>
  );
}
