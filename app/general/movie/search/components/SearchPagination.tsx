"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

type MovieList = {
  _id: string;
  name: string;
  slug: string;
  poster_url: string;
  year: number;
}[];

type Props = {
  totalPage: number;
};

export default function SearchPagination({ totalPage }: Props) {
  const search = useSearchParams();
  const searchTerm = search.get("s");
  const currentPage = search.get("page");

  let pageArray = [];

  for (let i = 0; i < totalPage; i++) {
    pageArray.push({
      id: i + 1,
      page: `${i + 1}`,
    });
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {/* <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem> */}
        {pageArray.map((item, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href={`/general/movie/search?s=${searchTerm}&page=${item.page}`}
              isActive={Number(currentPage) === item.id}
            >
              {item.page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {/* <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem> */}
      </PaginationContent>
    </Pagination>
  );
}
