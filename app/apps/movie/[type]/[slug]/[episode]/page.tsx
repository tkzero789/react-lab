"use client";

import { useParams } from "next/navigation";
import React from "react";
import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MovieVideo from "../../../components/movie-video";

type MovieDetail = {
  name: string;
  type: string;
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
  const [episodes, setEpisodes] = React.useState<MovieEpisode[]>();
  const [source, setSource] = React.useState<string>("");

  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`https://phimapi.com/phim/${params.slug}`);
        const data = await response.json();
        setMovie(data.movie);
        const episodes = data.episodes[0].server_data;
        setEpisodes(episodes);
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

  let typeTitle: string = "";
  switch (movie?.type as string) {
    case "movie":
      typeTitle = "Movie";
      break;
    case "series":
      typeTitle = "Series";
      break;
    case "hoathinh":
      typeTitle = "Animation";
      break;
    case "tvshows":
      typeTitle = "TV Shows";
      break;
  }

  const episodeNumber =
    typeof params.episode === "string"
      ? params.episode.split("-").pop()
      : params.episode?.[0];

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
            title: typeTitle,
            href: `/apps/movie/${movie?.type === "tvshows" ? "tv-shows" : movie?.type}`,
          },
          {
            title: movie?.name ?? "",
            href: `/apps/movie/${movie?.type}/${movie?.slug}`,
          },
          { title: `Tập ${episodeNumber}` },
        ]}
      />
      <DashboardContainer className="flex flex-col gap-8">
        <MovieVideo source={source} />
        <div className="flex flex-col gap-2">
          <div className="font-semibold">Episodes:</div>
          <div className="flex flex-wrap gap-1">
            {episodes?.map((episode) => (
              <Button
                key={episode.name}
                asChild
                variant={episode.slug === params.episode ? "primary" : "muted"}
                size="sm"
              >
                <Link href={`/apps/movie/${movie?.slug}/${episode.slug}`}>
                  {episode.slug === "full"
                    ? "Full"
                    : `Tập ${episode.name.split(" ")[1]}`}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </DashboardContainer>
    </>
  );
}
