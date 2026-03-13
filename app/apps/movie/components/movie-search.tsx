"use client";

import { Input } from "@/components/ui/input";
import { pathClient } from "@/lib/path-client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent } from "react";

export default function MovieSearch() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formatSearchTerm = searchTerm.trim().split(" ").join("-");
    router.push(pathClient(`/apps/movie/search?s=${formatSearchTerm}&page=1`));
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="w-full">
      <Input
        value={searchTerm}
        onChange={(e) => handleSearch(e)}
        placeholder="Search"
        className="w-full"
      />
    </form>
  );
}
