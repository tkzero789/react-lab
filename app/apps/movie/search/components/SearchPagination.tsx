"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

type Props = {
  totalPage: number;
};

export default function SearchPagination({ totalPage }: Props) {
  const search = useSearchParams();
  const searchTerm = search.get("s");
  const currentPage = search.get("page");

  const pageArray = [];

  for (let i = 0; i < totalPage; i++) {
    pageArray.push({
      id: i + 1,
      page: `${i + 1}`,
    });
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {pageArray.map((item, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href={`/apps/movie/search?s=${searchTerm}&page=${item.page}`}
              isActive={Number(currentPage) === item.id}
            >
              {item.page}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
}
