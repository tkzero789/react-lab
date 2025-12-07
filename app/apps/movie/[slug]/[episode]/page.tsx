"use client";

import { useParams } from "next/navigation";
import React from "react";
import MovieVideo from "../components/movie-video";
import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";

type MovieDetail = {
  name: string;
  slug: string;
  content: string;
  thumb_url: string;
  poster_url: string;
  time: string;
  episode_total: string;
  quality: string;
  year: number;
  actor: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  }[];
};

type MovieEpisode = {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
};

export default function EpisodePage() {
  const params = useParams();
  const [movie, setMovie] = React.useState<MovieDetail>();
  const [source, setSource] = React.useState<string>("");

  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`https://phimapi.com/phim/${params.slug}`);
        const data = await response.json();
        setMovie(data.movie);
        const episodes = data.episodes[0].server_data;
        episodes.find((item: MovieEpisode) => {
          if (item.slug === params.episode) {
            setSource(item.link_embed);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, [params.slug, params.episode]);

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
            title: movie?.name ?? "",
          },
        ]}
      />
      <DashboardContainer>
        <MovieVideo source={source} />
      </DashboardContainer>
    </>
  );
}
