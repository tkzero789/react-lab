import Image from "next/image";
import Link from "next/link";
import React from "react";
import "./Movie.css";
import { Play } from "lucide-react";

type MovieList = {
  name: string;
  slug: string;
  poster_url: string;
  year: number;
};

export default function MovieCard({ name, slug, poster_url, year }: MovieList) {
  return (
    <Link
      href={`/general/movie/detail/${slug}?episode=1`}
      className="flex h-full flex-col rounded-md shadow-sm"
    >
      <div className="movie-image relative h-80 overflow-hidden rounded-t-md">
        <Image
          src={poster_url}
          alt={name}
          width={295}
          height={384}
          className="h-full w-full rounded-t-md"
        />
        <div className="absolute right-2 top-2 rounded-md bg-gradient-to-r from-lime-500 to-green-600 px-2 py-1 text-sm text-white">
          {year}
        </div>
        <div className="movie-info-layer absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-t-md bg-gray-800 bg-opacity-40">
          <div className="rounded-full bg-gray-800 bg-opacity-80 p-4">
            <Play
              className="h-10 w-10 text-white text-opacity-80"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
      <h2 className="movie-title flex-1 rounded-b-md bg-gray-800 px-2 pb-4 pt-2 text-white">
        {name}
      </h2>
    </Link>
  );
}
