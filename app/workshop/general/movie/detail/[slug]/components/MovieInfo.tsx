"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

import React from "react";
import MovieVideo from "./MovieVideo";

type MovieDetail = {
  name: string;
  slug: string;
  content: string;
  thumb_url: string;
  trailer_url: string;
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

type MovieEpisodes = {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
}[];

type Props = {
  movie: MovieDetail;
  episodes: MovieEpisodes;
};

export default function MovieInfo({ movie, episodes }: Props) {
  const router = useRouter();
  const search = useSearchParams().get("episode");
  const [source, setSource] = React.useState<string>("");

  React.useEffect(() => {
    if (search === "1") {
      setSource(episodes[0].link_embed);
    }
  }, [search, episodes]);

  const handleChangeEpisode = (index: number) => {
    router.push(`/general/movie/detail/${movie.slug}?episode=${index + 1}`);
    const updateSource = episodes[index].link_embed;
    setSource(updateSource);
  };

  return (
    <div>
      <MovieVideo source={source} />
      <div className="mt-8 flex gap-2">
        <h1 className="text-3xl font-semibold">{movie.name}</h1>
        <div className="text-3xl">({movie.year})</div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="rounded-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 px-2 py-1 text-sm font-bold text-white">
          {movie.quality}
        </div>
        <div className="rounded-sm bg-gray-900 bg-opacity-70 px-2 py-1 text-sm font-semibold text-white dark:bg-background">
          {movie.episode_total} tập
        </div>
        <div className="rounded-sm bg-gray-900 bg-opacity-70 px-2 py-1 text-sm font-semibold text-white dark:bg-background">
          {movie.time}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {movie.category.map((item) => (
          <div
            key={item.id}
            className="rounded-sm bg-blue-900 bg-opacity-90 px-2 py-1 text-sm font-semibold text-white"
          >
            {item.name}
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-md bg-gray-200 p-4 dark:bg-background">
        {movie.content}
      </p>
      <div className="mt-4">
        Actors:
        <div className="mt-2 flex items-center gap-2">
          {movie.actor.map((item, index) => (
            <div
              key={index}
              className="rounded-sm bg-gray-200 bg-opacity-90 px-2 py-1 text-sm shadow-sm dark:bg-background"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        Episodes:
        <div className="mt-2 grid grid-cols-[repeat(14,minmax(0,1fr))]">
          {episodes.map((item, index) => (
            <Button
              key={index}
              onClick={() => handleChangeEpisode(index)}
              variant="outline"
              className="rounded-none"
            >
              {item.name.split(" ")[1]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
