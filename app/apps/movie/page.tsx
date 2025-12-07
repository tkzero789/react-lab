"use client";

import React from "react";
import MovieCard from "./components/MovieCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MovieSearch from "./components/MovieSearch";
import Container from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardBreadcrumb from "../components/dashboard-breadcrumb";
import DashboardContainer from "@/components/layout/dashboard-container";

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
    router.push(`/apps/movie?page=${pageNumber}`);
  };

  const handleNextPage = (page: string) => {
    setIsLoading(true);
    const pageNumber = Number(page) + 1;
    setPage(pageNumber.toString());
    router.push(`/apps/movie?page=${pageNumber}`);
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
          },
        ]}
      />
      <DashboardContainer className="grid gap-4">
        <div className="flex items-center justify-between">
          <MovieSearch />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {isLoading ? (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[19rem] md:h-[35rem] lg:h-[23rem]"
                ></Skeleton>
              ))}
            </>
          ) : (
            data?.map((movie: MovieList) => (
              <MovieCard key={movie._id} movie={movie} />
            ))
          )}
        </div>
        <div className="flex w-full justify-end gap-4">
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
      </DashboardContainer>
    </>
  );
}
