"use client";

import { useParams } from "next/navigation";
import React from "react";
import MovieVideo from "../components/movie-video";
import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";

export default function EpisodePage() {
  const params = useParams();
  const [movie, setMovie] = React.useState<any>();
  const [source, setSource] = React.useState<string>("");

  console.log(movie);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`https://phimapi.com/phim/${params.slug}`);
        const data = await response.json();
        setMovie(data.movie);
        const episodes = data.episodes[0].server_data;
        episodes.find((item: any) => {
          if (item.slug === params.episode) {
            setSource(item.link_embed);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

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
            href: "/apps/movie",
          },
          {
            title: movie && movie.name,
          },
        ]}
      />
      <DashboardContainer>
        <MovieVideo source={source} />
      </DashboardContainer>
    </>
  );
}
