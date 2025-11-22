"use client";

import React from "react";
import MovieCard from "./components/MovieCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MovieSearch from "./components/MovieSearch";
import Container from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

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
    router.push(`/workshop/general/movie?page=${pageNumber}`);
  };

  const handleNextPage = (page: string) => {
    setIsLoading(true);
    const pageNumber = Number(page) + 1;
    setPage(pageNumber.toString());
    router.push(`/workshop/general/movie?page=${pageNumber}`);
  };

  return (
    <Container>
      <h1>Movie app</h1>
      <div className="mt-8 flex items-center justify-between">
        <MovieSearch />
      </div>
      <div className="mt-8 grid grid-cols-5 gap-4">
        {isLoading ? (
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-[22rem]"></Skeleton>
            ))}
          </>
        ) : (
          data?.map((movie: MovieList) => (
            <MovieCard key={movie._id} movie={movie} />
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
    </Container>
  );
}
