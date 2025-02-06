import React from "react";
import MovieSearch from "../components/MovieSearch";
import MovieCard from "../components/MovieCard";
import SearchPagination from "./components/SearchPagination";

type Movie = {
  _id: string;
  name: string;
  slug: string;
  poster_url: string;
  year: number;
};

type Props = {
  searchParams: {
    s: string;
    page: number;
  };
};

export default async function MovieSearchPage({ searchParams }: Props) {
  const searchTerm = searchParams?.s;
  const currentPage = searchParams?.page;

  const formatSearchTerm = searchTerm.trim().split(" ").join("-");
  const res = await fetch(
    `https://phimapi.com/v1/api/tim-kiem?keyword=${formatSearchTerm}`,
  );
  const data = await res.json();
  const totalPage = Math.ceil(data.data.items.length / 10);

  let filteredMovies: Movie[] = [];

  const startIndex = (Number(currentPage) - 1) * 10;
  const endIndex = Number(currentPage) * 10;

  filteredMovies = data.data.items
    .slice(startIndex, endIndex)
    .map((item: Movie) => ({
      ...item,
      poster_url: `https://phimimg.com/${item.poster_url}`,
    }));

  console.log(data.data.items);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Search</h1>
      <div className="px-32">
        <div className="mt-8 flex items-center justify-between">
          <MovieSearch />
        </div>
        <div className="mt-8 grid grid-cols-5 gap-x-4 gap-y-8">
          {filteredMovies.map((movie: Movie) => (
            <MovieCard
              key={movie._id}
              name={movie.name}
              slug={movie.slug}
              poster_url={movie.poster_url}
              year={movie.year}
            />
          ))}
        </div>
        <SearchPagination totalPage={totalPage} />
      </div>
    </div>
  );
}
