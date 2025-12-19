"use client";

import React from "react";
import DashboardBreadcrumb from "../../components/dashboard-breadcrumb";
import { useParams, useSearchParams } from "next/navigation";
import MovieNav from "../components/movie-nav";
import MovieCard from "../components/movie-card";
import { Skeleton } from "@/components/ui/skeleton";
import MoviePagination from "../components/movie-pagination";
import Container from "@/components/layout/container";

type MovieType = {
  title: string;
  params?: "movie" | "series" | "hoathinh" | "tv-shows";
  typeList?: "phim-le" | "phim-bo" | "hoat-hinh" | "tv-shows";
};

const movieTypes: MovieType[] = [
  { title: "Home" },
  {
    title: "Movie",
    params: "movie",
    typeList: "phim-le",
  },
  {
    title: "Series",
    params: "series",
    typeList: "phim-bo",
  },
  {
    title: "Animation",
    params: "hoathinh",
    typeList: "hoat-hinh",
  },
  {
    title: "TV Shows",
    params: "tv-shows",
    typeList: "tv-shows",
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

type MovieState = {
  items: Movie[];
  params: {
    pagination: {
      currentPage: number;
      totalItems: number;
      totalItemsPerPage: number;
      totalPages: number;
    };
  };
};

export default function MovieTypePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page");
  const movieType = params.type;
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [movies, setMovies] = React.useState<MovieState>({
    items: [],
    params: {
      pagination: {
        currentPage: 0,
        totalItems: 0,
        totalItemsPerPage: 0,
        totalPages: 0,
      },
    },
  });

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
            `https://phimapi.com/v1/api/danh-sach/${movieObject?.typeList}?page=${currentPage}`,
          );
          const data = await response.json();
          setMovies(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [params, movieType, currentPage]);

  let typeTitle: string = "";
  switch (movieType as string) {
    case "movie":
      typeTitle = "Movie";
      break;
    case "series":
      typeTitle = "Series";
      break;
    case "hoathinh":
      typeTitle = "Animation";
      break;
    case "tv-shows":
      typeTitle = "TV Shows";
      break;
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
          {
            title: typeTitle,
          },
        ]}
      />
      <MovieNav />
      <Container className="flex flex-col gap-8 pb-[72px]">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[16rem] overflow-hidden rounded-xl min-[425px]:h-[20rem] sm:h-[18rem] lg:h-[22rem]"
                ></Skeleton>
              ))
            : movies.items.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
        </div>
        <MoviePagination
          path={`/apps/movie/${movieType}`}
          currentPage={Number(currentPage)}
          totalPages={movies.params.pagination.totalPages}
        />
      </Container>
    </>
  );
}
