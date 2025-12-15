"use client";

import React from "react";
import DashboardBreadcrumb from "../../components/dashboard-breadcrumb";
import { useParams } from "next/navigation";
import DashboardContainer from "@/components/layout/dashboard-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MovieNav from "../components/movie-nav";

type MovieType = {
  title: string;
  params?: "movie" | "series" | "hoathinh" | "tv-shows";
  type_list?: "phim-le" | "phim-bo" | "hoat-hinh" | "tv-shows";
};

const movieTypes: MovieType[] = [
  { title: "Home" },
  {
    title: "Movie",
    params: "movie",
    type_list: "phim-le",
  },
  {
    title: "Series",
    params: "series",
    type_list: "phim-bo",
  },
  {
    title: "Animation",
    params: "hoathinh",
    type_list: "hoat-hinh",
  },
  {
    title: "TV Shows",
    params: "tv-shows",
    type_list: "tv-shows",
  },
];

type Movie = {
  _id: string;
  name: string;
  type: string;
  slug: string;
  poster_url: string;
  thumb_url: string;
  time: string;
  episode_current: string;
  quality: string;
  year: number;
  category: {
    id: string;
    name: string;
    slug: string;
  }[];
};

export default function MovieTypePage() {
  const params = useParams();
  const movieType = params.type;
  const [movies, setMovies] = React.useState<Movie[]>();

  React.useEffect(() => {
    const getData = async () => {
      try {
        if (
          typeof movieType === "string" &&
          movieTypes.find((item) => item.params === movieType)
        ) {
          const movieObject = movieTypes.find(
            (item) => item.params === movieType,
          );
          const response = await fetch(
            `https://phimapi.com/v1/api/danh-sach/${movieObject?.type_list}`,
          );
          const data = await response.json();
          setMovies(data.data.items);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, [params, movieType]);

  if (!movies) {
    return <div>loading</div>;
  }

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
          { title: "Type" },
        ]}
      />
      <MovieNav />
      <DashboardContainer className="grid grid-cols-4 gap-4">
        {movies.map((movie) => (
          <Card key={movie._id}>
            <CardHeader>
              <CardTitle>{movie.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://phimapi.com/image.php?url=https://phimimg.com/${movie.poster_url}`}
                alt={movie.name}
                width={400}
                className="aspect-auto w-full rounded-xl object-cover"
              />
              <div className="flex flex-wrap gap-2">
                {movie.category.map((item) => (
                  <Badge key={item.id}>{item.name}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </DashboardContainer>
    </>
  );
}
