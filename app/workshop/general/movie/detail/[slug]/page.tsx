import React from "react";
import MovieInfo from "./components/MovieInfo";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function MovieDetailPage({ params }: Props) {
  const slug = (await params).slug;

  const res = await fetch(`https://phimapi.com/phim/${slug}`);
  const data = await res.json();

  const movieDetail = data.movie;
  const movieEpisodes = data.episodes[0].server_data;

  return (
    <div>
      <MovieInfo movie={movieDetail} episodes={movieEpisodes} />
    </div>
  );
}
