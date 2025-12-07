"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Container from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import MovieVideo from "../components/movie-video";

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

export default function EpisodeDetail({ movie, episodes }: Props) {
  const router = useRouter();
  const [source, setSource] = React.useState<string>("");

  React.useEffect(() => {
    router.push(`/apps/movie/${movie.slug}/${episodes[0].slug}`);
    setSource(episodes[0].link_embed);
  }, [episodes, movie.slug, router]);

  // const handleChangeEpisode = (episode: MovieEpisode) => {
  //   router.push(`/apps/movie/${movie.slug}/${episode.slug}`);

  //   setSource(episode.link_embed);
  // };

  return (
    <Container>
      <MovieVideo source={source} />
    </Container>
  );
}
