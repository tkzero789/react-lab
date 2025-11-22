"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

import React from "react";
import MovieVideo from "./MovieVideo";
import Container from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

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
    router.push(
      `/workshop/general/movie/detail/${movie.slug}?episode=${index + 1}`,
    );
    const updateSource = episodes[index].link_embed;
    setSource(updateSource);
  };

  console.log(episodes);

  return (
    <Container>
      <MovieVideo source={source} />
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-semibold">{movie.name}</h1>
          <div className="text-3xl">({movie.year})</div>
        </div>

        <div className="rounded-xl bg-muted px-4 py-2 font-semibold">
          Tập {search}
        </div>
      </div>
      <div className="flex items-center justify-between gap-8">
        <div className="mt-4 flex items-center gap-2">
          <Badge>{movie.quality}</Badge>
          <Badge variant="secondary">{movie.episode_total} tập</Badge>
          <Badge variant="secondary">{movie.time}</Badge>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {movie.category.map((item) => (
            <Badge variant="secondary" key={item.id}>
              {item.name}
            </Badge>
          ))}
        </div>
      </div>
      <div className="mt-8 rounded-xl bg-muted p-4">{movie.content}</div>
      <div className="mt-4">
        <div className="font-semibold">Actors:</div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {movie.actor.map((item, index) => (
            <Badge variant="muted" key={index} className="whitespace-nowrap">
              {item}
            </Badge>
          ))}
        </div>
      </div>
      <div className="mt-4">
        Episodes:
        <div className="mt-2 grid grid-cols-[repeat(14,minmax(0,1fr))]">
          {episodes.map((item, index) => (
            <Button
              variant="outline"
              size="sm"
              key={index}
              onClick={() => handleChangeEpisode(index)}
              className="rounded-none border-r-0 last:border-r"
            >
              {item.name.split(" ")[1]}
            </Button>
          ))}
        </div>
      </div>
    </Container>
  );
}
