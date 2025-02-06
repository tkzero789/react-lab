"use client";

import React from "react";
import MovieCard from "./components/MovieCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MovieSearch from "./components/MovieSearch";

type MovieList = {
  _id: string;
  name: string;
  slug: string;
  poster_url: string;
  year: number;
};

type Props = {
  searchParams: {
    page?: string;
  };
};

export default function MoviePage({ searchParams }: Props) {
  const router = useRouter();
  const [page, setPage] = React.useState<string>(searchParams.page || "1");
  const [data, setData] = React.useState<MovieList[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(
          `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`,
        );
        const data = await res.json();
        if (data) setData(data.items);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [page]);

  const handlePrevPage = (page: string) => {
    setIsLoading(true);
    const pageNumber = Number(page) - 1;
    setPage(pageNumber.toString());
    router.push(`/general/movie?page=${pageNumber}`);
  };

  const handleNextPage = (page: string) => {
    setIsLoading(true);
    const pageNumber = Number(page) + 1;
    setPage(pageNumber.toString());
    router.push(`/general/movie?page=${pageNumber}`);
  };

  return (
    <div>
      <h1 className="px-32 text-2xl font-semibold">Movie app</h1>
      <div className="px-32">
        <div className="mt-8 flex items-center justify-between">
          <MovieSearch />
        </div>
        <div className="mt-8 grid grid-cols-5 gap-x-4 gap-y-8">
          {isLoading ? (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[22rem] animate-pulse bg-gray-300 dark:bg-background"
                ></div>
              ))}
            </>
          ) : (
            data?.map((movie: MovieList) => (
              <MovieCard
                key={movie._id}
                name={movie.name}
                slug={movie.slug}
                poster_url={movie.poster_url}
                year={movie.year}
              />
            ))
          )}
        </div>
        <div className="mt-8 flex w-full justify-center gap-4">
          <Button
            onClick={() => {
              handlePrevPage(page);
            }}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              handleNextPage(page);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
