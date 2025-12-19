import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import React from "react";

type Props = {
  path: string;
  currentPage: number;
  totalPages: number;
};

export default function MoviePagination({
  path,
  currentPage,
  totalPages,
}: Props) {
  const router = useRouter();
  const [pageNumber, setPageNumber] = React.useState<string>("");
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const handlePageChange = (action: string, currentPage: number) => {
    if (currentPage === 2 && action === "prev") {
      router.push(`${path}`);
      return;
    }

    if (currentPage > 1 && action === "next") {
      currentPage = currentPage + 1;
      router.push(`${path}?page=${currentPage}`);
    } else if (currentPage > 1 && action === "prev") {
      currentPage = currentPage - 1;
      router.push(`${path}?page=${currentPage}`);
    }

    if (!currentPage && action === "next") {
      currentPage = currentPage + 2;
      router.push(`${path}?page=${currentPage}`);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(e.target.value);
  };

  const submitPageChange = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`${path}?page=${pageNumber}`);
    setIsOpen(false);
    setPageNumber("");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background p-4 md:static md:px-0">
      <div className="flex items-center justify-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="muted">
              Page {currentPage === 0 ? "1" : currentPage} of {totalPages}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            className="h-10 w-[var(--radix-popover-trigger-width)] p-0"
          >
            <form onSubmit={submitPageChange} className="h-full">
              <Input
                type="number"
                min={1}
                max={totalPages}
                placeholder="Go to page"
                value={pageNumber}
                onChange={handleOnChange}
              />
            </form>
          </PopoverContent>
        </Popover>
        <Button
          variant="muted"
          size="icon"
          disabled={!currentPage}
          onClick={() => handlePageChange("prev", currentPage)}
          className="ml-auto"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="muted"
          size="icon"
          onClick={() => handlePageChange("next", currentPage)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
