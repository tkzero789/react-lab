"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
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

type Props = {
  movie: MovieDetail;
  episodes: MovieEpisode[];
};

export default function MovieDetail({ movie, episodes }: Props) {
  const router = useRouter();
  const handleChangeEpisode = (episode: MovieEpisode) => {
    router.push(`/apps/movie/${movie.slug}/${episode.slug}`);
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
            title: movie.name,
          },
        ]}
      />
      <DashboardContainer>
        <div className="flex flex-col gap-4 lg:flex-row">
          <Image
            src={movie.poster_url}
            alt="Movie poster"
            width={600}
            height={900}
            priority
            className="aspect-[2/3] w-[30rem] rounded-xl"
          />
          <div className="flex flex-col gap-4">
            {/* Name */}
            <h1 className="text-3xl font-semibold">{movie.name}</h1>
            {/* Badges */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="text-lg">{movie.quality}</div>
                <div className="translate-y-[-1px]">|</div>
                <div className="text-lg">{movie.year}</div>
                <div className="translate-y-[-1px]">|</div>
                <div className="text-lg">{movie.episode_total} tập</div>
                <div className="translate-y-[-1px]">|</div>
                <div className="text-lg">{movie.time}</div>
              </div>
              <div className="flex items-center gap-2">
                {movie.category.map((item) => (
                  <Badge key={item.id}>{item.name}</Badge>
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
                {episodes.map((episode) => (
                  <Button
                    key={episode.name}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleChangeEpisode(episode)}
                  >
                    {episode.slug === "full"
                      ? "Full"
                      : `Tập ${episode.name.split(" ")[1]}`}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardContainer>
    </>
  );
}
