"use client";

import React from "react";
import DashboardContainer from "@/components/layout/dashboard-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";
import DashboardBreadcrumb from "@/app/apps/components/dashboard-breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

type MovieDetail = {
  name: string;
  type: string;
  slug: string;
  content: string;
  thumb_url: string;
  poster_url: string;
  episode_current: string;
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

  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`https://phimapi.com/phim/${params.slug}`);
        const data = await response.json();
        console.log(data);
        setMovie(data.movie);
        setEpisodes(data.episodes[0].server_data);
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

  const getTotalEpisodes = (currentEpisode: string) => {
    if (currentEpisode.startsWith("Tập")) {
      return currentEpisode.split(" ")[1];
    } else {
      return currentEpisode?.split("/")[1]?.split(")")[0];
    }
  };

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
          },
        ]}
      />
      <DashboardContainer>
        <div className="grid grid-cols-1 gap-4">
          {!movie ? (
            <Skeleton className="h-56 md:h-[400px] lg:h-[550px] xl:h-[700px]" />
          ) : (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://phimapi.com/image.php?url=${movie.thumb_url}`}
                alt="Movie poster"
                width={1280}
                height={600}
                className="aspect-video h-full w-full rounded-xl object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-1 rounded-xl bg-secondary/50 p-2 text-secondary-foreground backdrop-blur-sm dark:bg-muted/50 dark:text-foreground lg:bottom-6 lg:left-6 lg:right-6 lg:gap-4 lg:p-6">
                {/* Name */}
                <div className="text-lg font-medium lg:text-2xl">
                  {movie.name}
                </div>
                {/* Additional details */}
                <div className="flex items-center gap-2">
                  <div className="text-sm lg:text-lg">{movie.quality}</div>
                  <div className="translate-y-[-1px]">|</div>
                  <div className="text-sm lg:text-lg">{movie.year}</div>
                  <div className="translate-y-[-1px]">|</div>
                  {movie.episode_current !== "Full" && (
                    <div className="text-sm lg:text-lg">
                      {getTotalEpisodes(movie.episode_current)} tập
                    </div>
                  )}
                  {movie.episode_current !== "Full" && (
                    <div className="translate-y-[-1px]">|</div>
                  )}
                  <div className="text-sm lg:text-lg">{movie.time}</div>
                </div>
                {/* Category */}
                <div className="hidden items-center gap-2 lg:flex">
                  {movie.category.map((item) => (
                    <Badge key={item.id}>{item.name}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!movie ? (
            <Skeleton className="flex h-[32rem] flex-col gap-4" />
          ) : (
            <div className="flex flex-col gap-4">
              {/* Content */}
              <div className="rounded-xl bg-muted p-4">{movie.content}</div>
              {/* Categories */}
              <div className="flex flex-col gap-2 lg:hidden">
                <div className="font-semibold">Categories:</div>
                <div className="flex flex-wrap items-center gap-2">
                  {movie.category.map((item) => (
                    <Badge key={item.id} className="whitespace-nowrap">
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
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
                      key={episode.link_embed}
                      asChild
                      variant="muted"
                      size="sm"
                    >
                      <Link
                        href={`/apps/movie/${movie.type}/${movie.slug}/${episode.slug}`}
                      >
                        {episode.slug === "full"
                          ? "Full"
                          : `Tập ${episode.name.split(" ")[1]}`}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardContainer>
    </>
  );
}
