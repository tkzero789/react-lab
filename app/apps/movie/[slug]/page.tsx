"use client";

import React from "react";
import DashboardBreadcrumb from "../../components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";
import MovieNav from "../components/movie-nav";

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

export default function MovieDetailPage() {
  const params = useParams();

  const [movie, setMovie] = React.useState<MovieDetail>();
  const [episodes, setEpisodes] = React.useState<MovieEpisode[]>();

  console.log(episodes);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`https://phimapi.com/phim/${params.slug}`);
        const data = await response.json();
        setMovie(data.movie);
        setEpisodes(data.episodes[0].server_data);
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
      <MovieNav />
      <DashboardContainer className="relative flex-1">
        {!movie ? (
          <div></div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://phimapi.com/image.php?url=${movie.thumb_url}`}
              alt="Movie poster"
              width={800}
              height={600}
              className="col-span-full w-full rounded-xl lg:col-span-2"
            />
            <div className="col-span-full flex flex-col gap-4 lg:col-span-2">
              {/* Name */}
              <h1>{movie.name}</h1>
              {/* Badges */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-lg">{movie.quality}</div>
                  <div className="translate-y-[-1px]">|</div>
                  <div className="text-lg">{movie.year}</div>
                  <div className="translate-y-[-1px]">|</div>
                  <div className="text-lg">{movie.episode_total} tập</div>
                  <div className="translate-y-[-1px]">|</div>
                  <div className="text-lg">{movie.time}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {movie.category.map((item) => (
                    <Badge key={item.id} className="whitespace-nowrap">
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
              {/* Content */}
              <div className="rounded-xl bg-muted p-4">{movie.content}</div>
              {/* Actors */}
              <div className="flex flex-col gap-2">
                <div className="font-semibold">Actors:</div>
                <div className="flex flex-wrap items-center gap-2">
                  {movie.actor.map((item, index) => (
                    <Badge
                      key={index}
                      variant="muted"
                      className="whitespace-nowrap"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              {/* Episodes */}
              <div className="flex flex-col gap-2">
                <div className="font-semibold">Episodes:</div>
                <div className="flex flex-wrap gap-1">
                  {episodes?.map((episode) => (
                    <Button
                      key={episode.name}
                      asChild
                      variant="secondary"
                      size="sm"
                    >
                      <Link href={`/apps/movie/${movie.slug}/${episode.slug}`}>
                        {episode.slug === "full"
                          ? "Full"
                          : `Tập ${episode.name.split(" ")[1]}`}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardContainer>
    </>
  );
}
